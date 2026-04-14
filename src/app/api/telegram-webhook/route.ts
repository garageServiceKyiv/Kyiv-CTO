import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, getPortfolioImages, deleteFromCloudinary } from "@/lib/cloudinary";
import { CATEGORIES } from "@/lib/portfolio";
import { handlePricingCallback, handlePricingText, getPricingUserState, clearPricingUserState } from "@/lib/telegram-pricing";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

// In-memory state (resets on deploy)
const userCategory = new Map<number, string>();

const CATEGORY_LABELS: Record<string, string> = {
  engine: "Двигун",
  suspension: "Ходова",
  diagnostics: "Діагностика",
  electrical: "Електрика",
  brakes: "Гальма",
  maintenance: "ТО",
  cars: "Авто",
};

interface TelegramPhoto {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

interface TelegramMessage {
  message_id: number;
  from?: { id: number; first_name: string };
  chat: { id: number; type: string };
  text?: string;
  photo?: TelegramPhoto[];
  caption?: string;
}

interface TelegramCallbackQuery {
  id: string;
  from: { id: number; first_name: string };
  message?: { message_id: number; chat: { id: number } };
  data?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

export async function POST(request: NextRequest) {
  if (WEBHOOK_SECRET) {
    const secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (secret !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!BOT_TOKEN) return NextResponse.json({ ok: true });

  const update: TelegramUpdate = await request.json();

  // Handle callback from category buttons
  if (update.callback_query) {
    await handleCallback(update.callback_query);
    return NextResponse.json({ ok: true });
  }

  const message = update.message;
  if (!message) return NextResponse.json({ ok: true });

  // Handle /start command
  if (message.text === "/start") {
    await sendMainMenu(message.chat.id);
    return NextResponse.json({ ok: true });
  }

  // Handle menu buttons
  if (message.text === "📸 Завантажити фото") {
    const buttons = Object.entries(CATEGORY_LABELS).map(([slug, label]) => ([
      { text: label, callback_data: `cat:${slug}` },
    ]));
    await telegramRequest("sendMessage", {
      chat_id: message.chat.id,
      text: "📁 Оберіть категорію:",
      reply_markup: { inline_keyboard: buttons },
    });
    return NextResponse.json({ ok: true });
  }

  if (message.text === "💰 Ціни") {
    clearPricingUserState(message.from?.id ?? 0);
    await handlePricingCallback("pricing", message.chat.id, message.from?.id ?? 0, telegramRequest);
    return NextResponse.json({ ok: true });
  }

  // Handle pricing text input (multi-step flows)
  if (message.text && message.from?.id) {
    const state = getPricingUserState(message.from.id);
    if (state) {
      const handled = await handlePricingText(message.text, message.chat.id, message.from.id, telegramRequest);
      if (handled) return NextResponse.json({ ok: true });
    }
  }

  if (message.text === "🗑 Видалити фото") {
    const buttons = Object.entries(CATEGORY_LABELS).map(([slug, label]) => ([
      { text: label, callback_data: `delcat:${slug}` },
    ]));
    await telegramRequest("sendMessage", {
      chat_id: message.chat.id,
      text: "🗑 Оберіть категорію для видалення фото:",
      reply_markup: { inline_keyboard: buttons },
    });
    return NextResponse.json({ ok: true });
  }

  // Handle photo upload
  if (message.photo) {
    await handlePhoto(message);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}

async function sendMainMenu(chatId: number) {
  await telegramRequest("sendMessage", {
    chat_id: chatId,
    text: "👋 Вітаю! Я бот Auto Service Garage.\n\nОберіть дію за допомогою меню нижче 👇",
    reply_markup: {
      keyboard: [
        [{ text: "📸 Завантажити фото" }, { text: "🗑 Видалити фото" }],
        [{ text: "💰 Ціни" }],
      ],
      resize_keyboard: true,
      is_persistent: true,
    },
  });
}

async function handleCallback(callback: TelegramCallbackQuery) {
  const chatId = callback.message?.chat.id;
  if (!chatId) return;

  // Acknowledge button press
  await telegramRequest("answerCallbackQuery", { callback_query_id: callback.id });

  // Pricing callbacks
  if (callback.data === "pricing" || callback.data?.startsWith("p:")) {
    await handlePricingCallback(callback.data, chatId, callback.from.id, telegramRequest);
    return;
  }

  if (callback.data === "upload") {
    const buttons = Object.entries(CATEGORY_LABELS).map(([slug, label]) => ([
      { text: label, callback_data: `cat:${slug}` },
    ]));
    await telegramRequest("sendMessage", {
      chat_id: chatId,
      text: "📁 Оберіть категорію:",
      reply_markup: { inline_keyboard: buttons },
    });
    return;
  }

  if (callback.data?.startsWith("cat:")) {
    const category = callback.data.replace("cat:", "");
    const label = CATEGORY_LABELS[category];
    userCategory.set(callback.from.id, category);

    await telegramRequest("sendMessage", {
      chat_id: chatId,
      text: `✅ Категорія: **${label}**\n\n📸 Тепер надішліть фото.\nМожете додати підпис до фото (необов'язково).`,
      parse_mode: "Markdown",
    });
    return;
  }

  // Show delete: select category
  if (callback.data === "delete") {
    const buttons = Object.entries(CATEGORY_LABELS).map(([slug, label]) => ([
      { text: label, callback_data: `delcat:${slug}` },
    ]));

    await telegramRequest("sendMessage", {
      chat_id: chatId,
      text: "🗑 Оберіть категорію для видалення фото:",
      reply_markup: { inline_keyboard: buttons },
    });
    return;
  }

  // Show photos in category for deletion
  if (callback.data?.startsWith("delcat:")) {
    const category = callback.data.replace("delcat:", "");
    const label = CATEGORY_LABELS[category] ?? category;

    try {
      const images = await getPortfolioImages(category);

      if (images.length === 0) {
        await telegramRequest("sendMessage", {
          chat_id: chatId,
          text: `📁 Категорія "${label}" порожня.`,
          reply_markup: {
            inline_keyboard: [[{ text: "◀️ Назад", callback_data: "delete" }]],
          },
        });
        return;
      }

      for (const img of images) {
        await telegramRequest("sendPhoto", {
          chat_id: chatId,
          photo: img.url,
          caption: `📝 ${img.caption || "—"}\n📁 ${label}`,
          reply_markup: {
            inline_keyboard: [
              [{ text: "🗑 Видалити це фото", callback_data: `rm:${img.publicId}` }],
            ],
          },
        });
      }
    } catch (error) {
      console.error("[Webhook] List error:", error);
      await telegramRequest("sendMessage", {
        chat_id: chatId,
        text: "❌ Помилка при завантаженні списку фото.",
      });
    }
    return;
  }

  // Delete specific photo
  if (callback.data?.startsWith("rm:")) {
    const publicId = callback.data.replace("rm:", "");

    const deleted = await deleteFromCloudinary(publicId);

    if (deleted) {
      await telegramRequest("sendMessage", {
        chat_id: chatId,
        text: "✅ Фото видалено з портфоліо.",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🗑 Видалити ще", callback_data: "delete" }],
            [{ text: "📸 Завантажити фото", callback_data: "upload" }],
          ],
        },
      });
    } else {
      await telegramRequest("sendMessage", {
        chat_id: chatId,
        text: "❌ Не вдалося видалити фото.",
      });
    }
    return;
  }
}

async function handlePhoto(message: TelegramMessage) {
  const chatId = message.chat.id;
  const userId = message.from?.id;
  const photo = message.photo![message.photo!.length - 1];
  const caption = message.caption ?? "";

  // Check for hashtag in caption (legacy method)
  const hashtagMatch = caption.match(/#(\S+)/);
  const hashtag = hashtagMatch?.[1]?.toLowerCase() ?? "";
  let category = CATEGORIES[hashtag];
  let cleanCaption = caption;

  // If no hashtag, check saved category from button selection
  if (!category && userId) {
    category = userCategory.get(userId) ?? "";
  }

  if (hashtag) {
    cleanCaption = caption.replace(/#\S+/g, "").trim();
  }

  if (!category) {
    // No category — show selection
    const buttons = Object.entries(CATEGORY_LABELS).map(([slug, label]) => ([
      { text: label, callback_data: `cat:${slug}` },
    ]));

    await telegramRequest("sendMessage", {
      chat_id: chatId,
      text: "❌ Спочатку оберіть категорію, потім надішліть фото.",
      reply_markup: { inline_keyboard: buttons },
    });
    return;
  }

  try {
    const fileRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${photo.file_id}`
    );
    const fileData = await fileRes.json();
    const filePath = fileData.result?.file_path;

    if (!filePath) {
      await telegramRequest("sendMessage", {
        chat_id: chatId,
        text: "❌ Не вдалося отримати файл.",
      });
      return;
    }

    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
    const url = await uploadToCloudinary(fileUrl, category, cleanCaption);
    const label = CATEGORY_LABELS[category] ?? category;

    await telegramRequest("sendMessage", {
      chat_id: chatId,
      text: `✅ Фото додано!\n\n📁 Категорія: ${label}\n📝 Підпис: ${cleanCaption || "—"}\n🔗 ${url}`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📸 Завантажити ще", callback_data: `cat:${category}` }],
          [{ text: "📁 Змінити категорію", callback_data: "upload" }],
        ],
      },
    });
  } catch (error) {
    console.error("[Webhook] Upload error:", error);
    await telegramRequest("sendMessage", {
      chat_id: chatId,
      text: "❌ Помилка при завантаженні фото.",
    });
  }
}

async function telegramRequest(method: string, body: Record<string, unknown>) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

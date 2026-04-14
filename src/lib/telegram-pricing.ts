import { getPricing, savePricing } from "./pricing";
import type { PricingData } from "./pricing";

// User state for multi-step flows
interface UserState {
  action: string;
  sectionId?: string;
  itemIndex?: number;
  step?: string;
  tempName?: string;
}

const userStates = new Map<number, UserState>();

export function getPricingUserState(userId: number): UserState | undefined {
  return userStates.get(userId);
}

export function clearPricingUserState(userId: number) {
  userStates.delete(userId);
}

type TelegramSend = (method: string, body: Record<string, unknown>) => Promise<void>;

export async function handlePricingCallback(
  data: string,
  chatId: number,
  userId: number,
  send: TelegramSend
) {
  // Main pricing menu
  if (data === "pricing") {
    await showPricingMenu(chatId, send);
    return;
  }

  // Show all sections
  if (data === "p:sections") {
    const pricing = await getPricing();

    if (pricing.sections.length === 0) {
      await send("sendMessage", {
        chat_id: chatId,
        text: "Розділів поки немає.",
        reply_markup: {
          inline_keyboard: [
            [{ text: "➕ Додати розділ", callback_data: "p:add_section" }],
            [{ text: "◀️ Назад", callback_data: "pricing" }],
          ],
        },
      });
      return;
    }

    const buttons = pricing.sections.map((s) => [
      { text: s.title, callback_data: `p:sec:${s.id}` },
    ]);
    buttons.push([{ text: "➕ Додати розділ", callback_data: "p:add_section" }]);
    buttons.push([{ text: "◀️ Назад", callback_data: "pricing" }]);

    await send("sendMessage", {
      chat_id: chatId,
      text: "📋 Оберіть розділ:",
      reply_markup: { inline_keyboard: buttons },
    });
    return;
  }

  // Show specific section
  if (data.startsWith("p:sec:")) {
    const sectionId = data.replace("p:sec:", "");
    await showSection(chatId, sectionId, send);
    return;
  }

  // Add section — ask for name
  if (data === "p:add_section") {
    userStates.set(userId, { action: "add_section", step: "name" });
    await send("sendMessage", {
      chat_id: chatId,
      text: "📝 Введіть назву нового розділу:",
    });
    return;
  }

  // Delete section
  if (data.startsWith("p:del_sec:")) {
    const sectionId = data.replace("p:del_sec:", "");
    const pricing = await getPricing();
    const section = pricing.sections.find((s) => s.id === sectionId);

    if (section) {
      pricing.sections = pricing.sections.filter((s) => s.id !== sectionId);
      await savePricing(pricing);
      await send("sendMessage", {
        chat_id: chatId,
        text: `✅ Розділ "${section.title}" видалено.`,
        reply_markup: {
          inline_keyboard: [[{ text: "◀️ До розділів", callback_data: "p:sections" }]],
        },
      });
    }
    return;
  }

  // Add item to section — ask for name
  if (data.startsWith("p:add_item:")) {
    const sectionId = data.replace("p:add_item:", "");
    userStates.set(userId, { action: "add_item", sectionId, step: "name" });
    await send("sendMessage", {
      chat_id: chatId,
      text: "📝 Введіть назву послуги:",
    });
    return;
  }

  // Show item for editing/deleting
  if (data.startsWith("p:item:")) {
    const parts = data.replace("p:item:", "").split(":");
    const sectionId = parts[0];
    const itemIndex = parseInt(parts[1]);
    const pricing = await getPricing();
    const section = pricing.sections.find((s) => s.id === sectionId);
    const item = section?.items[itemIndex];

    if (!section || !item) return;

    await send("sendMessage", {
      chat_id: chatId,
      text: `📌 *${item.name}*\n💰 ${item.price}${item.desc ? `\n📝 ${item.desc}` : ""}`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "✏️ Змінити назву", callback_data: `p:edit_name:${sectionId}:${itemIndex}` }],
          [{ text: "💰 Змінити ціну", callback_data: `p:edit_price:${sectionId}:${itemIndex}` }],
          [{ text: "🗑 Видалити", callback_data: `p:del_item:${sectionId}:${itemIndex}` }],
          [{ text: "◀️ Назад", callback_data: `p:sec:${sectionId}` }],
        ],
      },
    });
    return;
  }

  // Edit item name
  if (data.startsWith("p:edit_name:")) {
    const parts = data.replace("p:edit_name:", "").split(":");
    userStates.set(userId, {
      action: "edit_item_name",
      sectionId: parts[0],
      itemIndex: parseInt(parts[1]),
    });
    await send("sendMessage", {
      chat_id: chatId,
      text: "✏️ Введіть нову назву послуги:",
    });
    return;
  }

  // Edit item price
  if (data.startsWith("p:edit_price:")) {
    const parts = data.replace("p:edit_price:", "").split(":");
    userStates.set(userId, {
      action: "edit_item_price",
      sectionId: parts[0],
      itemIndex: parseInt(parts[1]),
    });
    await send("sendMessage", {
      chat_id: chatId,
      text: "💰 Введіть нову ціну (наприклад: від 1 200 ₴):",
    });
    return;
  }

  // Delete item
  if (data.startsWith("p:del_item:")) {
    const parts = data.replace("p:del_item:", "").split(":");
    const sectionId = parts[0];
    const itemIndex = parseInt(parts[1]);
    const pricing = await getPricing();
    const section = pricing.sections.find((s) => s.id === sectionId);

    if (section && section.items[itemIndex]) {
      const name = section.items[itemIndex].name;
      section.items.splice(itemIndex, 1);
      await savePricing(pricing);
      await send("sendMessage", {
        chat_id: chatId,
        text: `✅ "${name}" видалено.`,
        reply_markup: {
          inline_keyboard: [[{ text: "◀️ До розділу", callback_data: `p:sec:${sectionId}` }]],
        },
      });
    }
    return;
  }

  // Rename section
  if (data.startsWith("p:rename_sec:")) {
    const sectionId = data.replace("p:rename_sec:", "");
    userStates.set(userId, { action: "rename_section", sectionId });
    await send("sendMessage", {
      chat_id: chatId,
      text: "✏️ Введіть нову назву розділу:",
    });
    return;
  }
}

export async function handlePricingText(
  text: string,
  chatId: number,
  userId: number,
  send: TelegramSend
): Promise<boolean> {
  const state = userStates.get(userId);
  if (!state) return false;

  const pricing = await getPricing();

  // Add section
  if (state.action === "add_section" && state.step === "name") {
    const id = text.toLowerCase().replace(/[^a-zа-яіїєґ0-9]/g, "_").slice(0, 30);
    pricing.sections.push({ id: `custom_${Date.now()}`, title: text, items: [] });
    await savePricing(pricing);
    userStates.delete(userId);

    await send("sendMessage", {
      chat_id: chatId,
      text: `✅ Розділ "${text}" створено. Тепер додайте послуги.`,
      reply_markup: {
        inline_keyboard: [[{ text: "◀️ До розділів", callback_data: "p:sections" }]],
      },
    });
    return true;
  }

  // Rename section
  if (state.action === "rename_section" && state.sectionId) {
    const section = pricing.sections.find((s) => s.id === state.sectionId);
    if (section) {
      section.title = text;
      await savePricing(pricing);
    }
    userStates.delete(userId);

    await send("sendMessage", {
      chat_id: chatId,
      text: `✅ Розділ перейменовано на "${text}".`,
      reply_markup: {
        inline_keyboard: [[{ text: "◀️ До розділу", callback_data: `p:sec:${state.sectionId}` }]],
      },
    });
    return true;
  }

  // Add item — step 1: name
  if (state.action === "add_item" && state.step === "name") {
    state.tempName = text;
    state.step = "price";
    userStates.set(userId, state);

    await send("sendMessage", {
      chat_id: chatId,
      text: `💰 Введіть ціну для "${text}" (наприклад: від 1 200 ₴):`,
    });
    return true;
  }

  // Add item — step 2: price
  if (state.action === "add_item" && state.step === "price" && state.sectionId) {
    const section = pricing.sections.find((s) => s.id === state.sectionId);
    if (section && state.tempName) {
      section.items.push({ name: state.tempName, price: text });
      await savePricing(pricing);
    }
    userStates.delete(userId);

    await send("sendMessage", {
      chat_id: chatId,
      text: `✅ Додано: "${state.tempName}" — ${text}`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "➕ Додати ще", callback_data: `p:add_item:${state.sectionId}` }],
          [{ text: "◀️ До розділу", callback_data: `p:sec:${state.sectionId}` }],
        ],
      },
    });
    return true;
  }

  // Edit item name
  if (state.action === "edit_item_name" && state.sectionId !== undefined && state.itemIndex !== undefined) {
    const section = pricing.sections.find((s) => s.id === state.sectionId);
    if (section?.items[state.itemIndex]) {
      section.items[state.itemIndex].name = text;
      await savePricing(pricing);
    }
    const sectionId = state.sectionId;
    userStates.delete(userId);

    await send("sendMessage", {
      chat_id: chatId,
      text: `✅ Назву змінено на "${text}".`,
      reply_markup: {
        inline_keyboard: [[{ text: "◀️ До розділу", callback_data: `p:sec:${sectionId}` }]],
      },
    });
    return true;
  }

  // Edit item price
  if (state.action === "edit_item_price" && state.sectionId !== undefined && state.itemIndex !== undefined) {
    const section = pricing.sections.find((s) => s.id === state.sectionId);
    if (section?.items[state.itemIndex]) {
      section.items[state.itemIndex].price = text;
      await savePricing(pricing);
    }
    const sectionId = state.sectionId;
    userStates.delete(userId);

    await send("sendMessage", {
      chat_id: chatId,
      text: `✅ Ціну змінено на "${text}".`,
      reply_markup: {
        inline_keyboard: [[{ text: "◀️ До розділу", callback_data: `p:sec:${sectionId}` }]],
      },
    });
    return true;
  }

  return false;
}

async function showPricingMenu(chatId: number, send: TelegramSend) {
  await send("sendMessage", {
    chat_id: chatId,
    text: "💰 Управління цінами\n\nОберіть дію:",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📋 Переглянути розділи", callback_data: "p:sections" }],
        [{ text: "➕ Додати розділ", callback_data: "p:add_section" }],
      ],
    },
  });
}

async function showSection(chatId: number, sectionId: string, send: TelegramSend) {
  const pricing = await getPricing();
  const section = pricing.sections.find((s) => s.id === sectionId);

  if (!section) {
    await send("sendMessage", { chat_id: chatId, text: "❌ Розділ не знайдено." });
    return;
  }

  let text = `📋 *${section.title}*\n\n`;
  if (section.items.length === 0) {
    text += "Послуг поки немає.";
  } else {
    section.items.forEach((item, i) => {
      text += `${i + 1}. ${item.name} — ${item.price}\n`;
    });
  }

  const itemButtons = section.items.map((item, i) => [
    { text: `${i + 1}. ${item.name}`, callback_data: `p:item:${sectionId}:${i}` },
  ]);

  await send("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        ...itemButtons,
        [{ text: "➕ Додати послугу", callback_data: `p:add_item:${sectionId}` }],
        [
          { text: "✏️ Перейменувати", callback_data: `p:rename_sec:${sectionId}` },
          { text: "🗑 Видалити розділ", callback_data: `p:del_sec:${sectionId}` },
        ],
        [{ text: "◀️ Назад", callback_data: "p:sections" }],
      ],
    },
  });
}

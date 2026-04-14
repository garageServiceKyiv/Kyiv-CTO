const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export interface ContactFormData {
  name: string;
  phone: string;
  car?: string;
  service?: string;
  message?: string;
}

export async function sendToTelegram(data: ContactFormData): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("[Telegram] TELEGRAM_BOT_TOKEN або TELEGRAM_CHAT_ID не налаштовані");
    return false;
  }

  const lines = [
    "🔔 Нова заявка з сайту",
    `🕐 ${new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" })}`,
    "",
    `👤 Ім'я: ${data.name}`,
    `📞 Телефон: ${data.phone}`,
    data.car ? `🚗 Авто: ${data.car}` : null,
    data.service ? `🔧 Послуга: ${data.service}` : null,
    data.message ? `\n💬 Повідомлення:\n${data.message}` : null,
    "",
  ];

  const text = lines.filter(Boolean).join("\n");

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("[Telegram] Помилка відправки:", res.status, err);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Telegram] Мережева помилка:", error);
    return false;
  }
}


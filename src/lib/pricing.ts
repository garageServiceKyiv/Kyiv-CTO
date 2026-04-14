import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PRICING_PUBLIC_ID = "pricing_data";

export interface PriceItem {
  name: string;
  price: string;
  desc?: string;
}

export interface PricingSection {
  id: string;
  title: string;
  items: PriceItem[];
}

export interface PricingData {
  sections: PricingSection[];
}

const DEFAULT_PRICING: PricingData = {
  sections: [
    {
      id: "engine",
      title: "Двигун та трансмісія",
      items: [
        { name: "Комп'ютерна діагностика та замір компресії", price: "від 1 200 ₴" },
        { name: "Заміна прокладки головки блоку циліндрів", price: "від 8 500 ₴" },
        { name: "Сервіс ГРМ (пасок / ланцюг)", price: "від 4 200 ₴" },
        { name: "Капітальний ремонт двигуна", price: "від 25 000 ₴" },
      ],
    },
    {
      id: "maintenance",
      title: "Регламентне ТО",
      items: [
        { name: "Заміна мастила та фільтрів", price: "800 ₴", desc: "Синтетичне мастило, заміна фільтра та візуальний огляд." },
        { name: "Повний тех-аудит", price: "2 400 ₴", desc: "Глибока діагностика, аналіз робочих рідин та телеметрія." },
        { name: "Зимовий пакет", price: "1 500 ₴", desc: "Тест АКБ, промивка системи охолодження та обробка ущільнювачів." },
      ],
    },
    {
      id: "suspension",
      title: "Ходова частина",
      items: [
        { name: "Діагностика ходової", price: "від 500 ₴" },
        { name: "Заміна амортизаторів (пара)", price: "від 2 000 ₴" },
        { name: "Розвал-сходження", price: "від 800 ₴" },
        { name: "Заміна важелів підвіски", price: "від 1 500 ₴" },
      ],
    },
    {
      id: "brakes",
      title: "Гальма",
      items: [
        { name: "Заміна колодок (вісь)", price: "від 400 ₴" },
        { name: "Заміна гальмівних дисків", price: "від 1 200 ₴" },
        { name: "Діагностика ABS", price: "від 500 ₴" },
      ],
    },
    {
      id: "electrical",
      title: "Електрика",
      items: [
        { name: "Діагностика електрики", price: "від 600 ₴" },
        { name: "Ремонт генератора", price: "від 1 500 ₴" },
        { name: "Ремонт стартера", price: "від 1 200 ₴" },
        { name: "Ремонт проводки", price: "від 800 ₴" },
      ],
    },
  ],
};

export async function getPricing(): Promise<PricingData> {
  try {
    const result = await cloudinary.api.resource(PRICING_PUBLIC_ID, {
      resource_type: "raw",
    });
    const res = await fetch(result.secure_url);
    return (await res.json()) as PricingData;
  } catch {
    // First time — upload default pricing
    await savePricing(DEFAULT_PRICING);
    return DEFAULT_PRICING;
  }
}

export async function savePricing(data: PricingData): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  const dataUri = `data:application/json;base64,${Buffer.from(json).toString("base64")}`;

  await cloudinary.uploader.upload(dataUri, {
    public_id: PRICING_PUBLIC_ID,
    resource_type: "raw",
    overwrite: true,
    invalidate: true,
  });
}

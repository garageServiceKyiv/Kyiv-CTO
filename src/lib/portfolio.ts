export interface PortfolioImage {
  publicId: string;
  url: string;
  width: number;
  height: number;
  caption: string;
  category: string;
  createdAt: string;
}

export const CATEGORIES: Record<string, string> = {
  "двигун": "engine",
  "ходова": "suspension",
  "діагностика": "diagnostics",
  "електрика": "electrical",
  "гальма": "brakes",
  "то": "maintenance",
  "авто": "cars",
};

const CATEGORY_LABELS: Record<string, string> = {
  engine: "Двигун",
  suspension: "Ходова",
  diagnostics: "Діагностика",
  electrical: "Електрика",
  brakes: "Гальма",
  maintenance: "ТО",
  cars: "Авто",
};

export function getCategoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] ?? slug;
}

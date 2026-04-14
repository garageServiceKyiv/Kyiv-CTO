import { PAGE_SEO } from "@/config/seo";
import Link from "next/link";

export const metadata = {
  title: PAGE_SEO.reviews.title,
  description: PAGE_SEO.reviews.description,
  keywords: PAGE_SEO.reviews.keywords,
};

const FEATURED_REVIEW = {
  text: "Рівень технічної детальності в Auto Service Garage не має рівних. Вони не просто лагодять авто, вони оптимізують його для треку. Мій BMW став зовсім іншою машиною після їх роботи.",
  name: "Олександр К.",
  car: "BMW 320d",
  stars: 5,
};

const REVIEWS = [
  {
    text: "Привезла машину на діагностику — все пояснили зрозумілою мовою, без нав'язування зайвих послуг.",
    name: "Марія Т.",
    car: "Toyota Camry",
  },
  {
    text: "Кращий сервіс по електриці в Києві. Знайшли проблему, яку два інші сервіси не змогли діагностувати.",
    name: "Дмитро С.",
    car: "Renault Megane",
  },
  {
    text: "Регулярно обслуговую тут свій авто. Завжди чесні ціни, якісні запчастини та професійний підхід.",
    name: "Артем Л.",
    car: "Volkswagen Golf",
  },
  {
    text: "Зробили капітальний ремонт двигуна — машина їде як нова. Дуже задоволений результатом.",
    name: "Максим В.",
    car: "Skoda Octavia",
  },
];

export default function ReviewsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <span className="font-headline text-secondary text-xs tracking-[0.3em] uppercase mb-4 block">
            Технологічна довіра / 5.0
          </span>
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-6">
            Дані <span className="text-primary-container">клієнтів</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-xl">
            Показники продуктивності вимірюються не задоволенням — це найвищий критерій. Реальні відгуки від реальних клієнтів.
          </p>
        </div>
      </section>

      {/* Featured Review */}
      <section className="px-6 lg:px-10 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface-container p-10 border border-outline-variant/20">
            <div className="flex gap-1 mb-6">
              {Array.from({ length: FEATURED_REVIEW.stars }).map((_, i) => (
                <svg key={i} className="w-5 h-5 text-primary-container" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <h3 className="font-headline text-2xl font-bold uppercase mb-4">
              &ldquo;Понад хірургічну точність.&rdquo;
            </h3>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-8 italic">
              &ldquo;{FEATURED_REVIEW.text}&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-surface-bright rounded-sm" />
              <div>
                <div className="font-headline font-bold uppercase">{FEATURED_REVIEW.name}</div>
                <div className="text-[10px] font-headline text-secondary uppercase">{FEATURED_REVIEW.car}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REVIEWS.slice(0, 2).map((review) => (
              <div key={review.name} className="bg-surface-container-low p-6 border border-outline-variant/20 hover:border-secondary/30 transition-colors">
                <p className="text-on-surface-variant text-sm mb-6 italic">&ldquo;{review.text}&rdquo;</p>
                <div>
                  <div className="font-headline font-bold text-sm uppercase">{review.name}</div>
                  <div className="text-[10px] font-headline text-secondary uppercase">{review.car}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Reviews */}
      <section className="px-6 lg:px-10 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {REVIEWS.slice(2).map((review) => (
            <div key={review.name} className="bg-surface-container-low p-6 border border-outline-variant/20 hover:border-secondary/30 transition-colors">
              <p className="text-on-surface-variant text-sm mb-6 italic">&ldquo;{review.text}&rdquo;</p>
              <div>
                <div className="font-headline font-bold text-sm uppercase">{review.name}</div>
                <div className="text-[10px] font-headline text-secondary uppercase">{review.car}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leave review CTA */}
      <section className="px-6 lg:px-10 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="bg-surface-container p-10 border border-secondary/20">
            <h2 className="font-headline text-2xl font-bold uppercase mb-2">Залиште свій відгук</h2>
            <p className="text-on-surface-variant text-sm mb-6">Напишіть нам в Instagram або залиште заявку на сайті.</p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://www.instagram.com/avtoservis_garage_cto"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-container text-on-primary font-headline font-bold uppercase tracking-tighter px-6 py-3 hover:bg-primary-dim transition-colors"
              >
                Instagram
              </a>
              <Link
                href="/contacts#form"
                className="border border-white/20 text-white font-headline font-bold uppercase tracking-tighter px-6 py-3 hover:bg-white/5 transition-colors"
              >
                Залишити заявку
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="py-20 bg-surface-container-low border-t border-outline-variant/20">
        <div className="container mx-auto px-6 lg:px-10 text-center">
          <span className="font-headline text-[10px] text-white/30 uppercase tracking-[0.4em] mb-4 block">
            Якість підтверджена
          </span>
          <h2 className="font-headline text-4xl md:text-6xl font-black uppercase tracking-tighter">
            Створено для <span className="text-primary-container">вашого авто</span>
          </h2>
        </div>
      </section>
    </>
  );
}

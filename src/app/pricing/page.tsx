import { PAGE_SEO } from "@/config/seo";
import { getPricing } from "@/lib/pricing";
import Link from "next/link";

export const metadata = {
  title: PAGE_SEO.pricing.title,
  description: PAGE_SEO.pricing.description,
  keywords: PAGE_SEO.pricing.keywords,
};

export const revalidate = 60;

export default async function PricingPage() {
  const pricing = await getPricing();

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6 border-b border-outline-variant/20 pb-10">
          <div className="max-w-2xl">
            <span className="font-headline text-secondary text-sm tracking-[0.3em] uppercase mb-4 block">
              Інженерна точність
            </span>
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
              Протоколи <span className="text-primary-container">обслуговування</span>
            </h1>
          </div>
          <p className="text-white/60 max-w-xs text-sm">
            Прозоре ціноутворення на технічне обслуговування. Ціни вказані без урахування запчастин.
          </p>
        </div>
      </section>

      {/* Pricing sections */}
      <section className="px-6 lg:px-10 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {pricing.sections.map((section) => (
            <div
              key={section.id}
              className="bg-surface-container-low p-8 border border-outline-variant/20"
            >
              <h2 className="font-headline text-2xl font-black uppercase tracking-tighter mb-6">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-start py-3 border-b border-outline-variant/10 hover:bg-white/5 px-2 transition-colors"
                  >
                    <div>
                      <span className="font-body font-medium">{item.name}</span>
                      {item.desc && (
                        <p className="text-xs text-outline mt-1">{item.desc}</p>
                      )}
                    </div>
                    <span className="font-headline text-secondary ml-4 whitespace-nowrap">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-container">
        <div className="container mx-auto px-6 lg:px-10 text-center">
          <h2 className="font-headline text-3xl md:text-5xl font-black uppercase tracking-tighter text-on-primary mb-4">
            Готові записатися?
          </h2>
          <p className="text-on-primary/70 mb-8 max-w-lg mx-auto">
            Залиште заявку онлайн або зателефонуйте нам. Точна вартість визначається після діагностики.
          </p>
          <Link
            href="/contacts"
            className="inline-block bg-background text-white font-headline font-bold uppercase tracking-tighter px-10 py-4 hover:bg-surface-container-high transition-colors"
          >
            Записатися на сервіс
          </Link>
        </div>
      </section>
    </>
  );
}

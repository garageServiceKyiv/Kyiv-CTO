import { PAGE_SEO } from "@/config/seo";
import { getPortfolioImages } from "@/lib/cloudinary";
import Link from "next/link";
import PortfolioGallery from "@/components/sections/PortfolioGallery";

export const metadata = {
  title: PAGE_SEO.portfolio.title,
  description: PAGE_SEO.portfolio.description,
  keywords: PAGE_SEO.portfolio.keywords,
};

export const revalidate = 60; // revalidate every 60 seconds

export default async function PortfolioPage() {
  const images = await getPortfolioImages();

  const categories = [...new Set(images.map((img) => img.category))];

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <span className="font-headline text-secondary text-xs tracking-[0.3em] uppercase mb-4 block">
            Наші / Роботи
          </span>
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-6">
            Інженерна <span className="text-primary-container">точність.</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-xl">
            Ознайомтесь з нашими кейсами — від діагностики до капітального
            ремонту. Кожен проєкт виконано з максимальною увагою до деталей.
          </p>
        </div>
      </section>

      {/* Gallery */}
      {images.length > 0 ? (
        <PortfolioGallery images={images} categories={categories} />
      ) : (
        <section className="px-6 lg:px-10 pb-24">
          <div className="max-w-7xl mx-auto text-center py-20">
            <p className="text-on-surface-variant text-lg">
              Фото робіт скоро з&apos;являться. Слідкуйте за оновленнями!
            </p>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-primary-container">
        <div className="container mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-headline text-3xl md:text-4xl font-black uppercase tracking-tighter text-on-primary">
              Ваша машина заслуговує на майстерність.
            </h2>
            <p className="text-on-primary/70 mt-2">
              Запишіться на професійну діагностику вже сьогодні.
            </p>
          </div>
          <Link
            href="/contacts#form"
            className="bg-background text-white font-headline font-bold uppercase tracking-tighter px-8 py-4 hover:bg-surface-container-high transition-colors whitespace-nowrap"
          >
            Записатися на сервіс
          </Link>
        </div>
      </section>
    </>
  );
}

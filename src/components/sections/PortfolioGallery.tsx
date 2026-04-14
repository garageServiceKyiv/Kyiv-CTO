"use client";

import { useState, useEffect, useCallback } from "react";
import { getCategoryLabel } from "@/lib/portfolio";
import type { PortfolioImage } from "@/lib/portfolio";

interface Props {
  images: PortfolioImage[];
  categories: string[];
}

export default function PortfolioGallery({ images, categories }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = active
    ? images.filter((img) => img.category === active)
    : images;

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const goPrev = useCallback(() => {
    setLightbox((i) => (i !== null && i > 0 ? i - 1 : filtered.length - 1));
  }, [filtered.length]);

  const goNext = useCallback(() => {
    setLightbox((i) => (i !== null && i < filtered.length - 1 ? i + 1 : 0));
  }, [filtered.length]);

  useEffect(() => {
    if (lightbox === null) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, closeLightbox, goPrev, goNext]);

  return (
    <>
      <section className="px-6 lg:px-10 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Category filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            <button
              onClick={() => setActive(null)}
              className={`font-headline text-sm uppercase tracking-wider px-5 py-2 border transition-colors ${
                active === null
                  ? "bg-primary-container text-on-primary border-primary-container"
                  : "border-outline-variant/30 text-on-surface-variant hover:text-white hover:border-white/30"
              }`}
            >
              Усі роботи
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActive(cat); setLightbox(null); }}
                className={`font-headline text-sm uppercase tracking-wider px-5 py-2 border transition-colors ${
                  active === cat
                    ? "bg-primary-container text-on-primary border-primary-container"
                    : "border-outline-variant/30 text-on-surface-variant hover:text-white hover:border-white/30"
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((img, index) => (
              <div
                key={img.url}
                className="relative h-[300px] overflow-hidden group cursor-pointer"
                onClick={() => setLightbox(index)}
              >
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={img.url}
                  alt={img.caption || getCategoryLabel(img.category)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 p-6 w-full translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {img.caption && (
                    <p className="font-headline text-sm font-bold text-white mb-1">
                      {img.caption}
                    </p>
                  )}
                  <span className="text-xs text-secondary uppercase tracking-widest">
                    {getCategoryLabel(img.category)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
            aria-label="Закрити"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-6 font-headline text-sm text-white/40">
            {lightbox + 1} / {filtered.length}
          </div>

          {/* Prev button */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 md:left-8 text-white/40 hover:text-white transition-colors z-10"
            aria-label="Попередня"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filtered[lightbox].url.replace("c_fill,w_800,h_600,", "c_limit,w_1600,h_1200,")}
              alt={filtered[lightbox].caption || ""}
              className="max-w-full max-h-[75vh] object-contain"
            />
            {filtered[lightbox].caption && (
              <p className="mt-4 text-white/80 font-headline text-sm text-center">
                {filtered[lightbox].caption}
              </p>
            )}
            <span className="mt-1 text-xs text-secondary uppercase tracking-widest">
              {getCategoryLabel(filtered[lightbox].category)}
            </span>
          </div>

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 md:right-8 text-white/40 hover:text-white transition-colors z-10"
            aria-label="Наступна"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

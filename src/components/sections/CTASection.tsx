import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 bg-surface-container relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img
          className="w-full h-full object-cover grayscale"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxOMgLn5PyPOxq-O66jI2pc13s95hIHP5kzf6VVToPBSP2KB6YEKZJjtSfNY7AGmWMrJ1kSi_WmiYYh3CVhpkF_nLBCFj5sssnbH2XlAvbKoTHtxz32OpuHzBDbfyD51AgS21tfz_jNrGhQwxEUz-v-AUrpXMQv5rrxlxJEPQxon6aY9JvU58AnzUpJMz5jbeHl84hCMZhyj6pIGxS9ZwUwok7MNWi2vhPJb5A-xzGLP_1k_S6KeM6gMIcocxwCzSS2ghv7xG-HMg"
          alt=""
        />
      </div>
      <div className="container mx-auto px-6 lg:px-10 relative z-10 text-center">
        <h2 className="font-headline text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-6">
          Ваша машина заслуговує на{" "}
          <span className="text-primary-container">майстерність.</span>
        </h2>
        <p className="text-on-surface-variant text-lg max-w-xl mx-auto mb-10">
          Запишіться на професійну діагностику та обслуговування вже сьогодні.
        </p>
        <Link
          href="/contacts#form"
          className="inline-block bg-primary-container text-on-primary font-headline font-black uppercase text-lg px-12 py-4 tracking-widest hover:scale-105 transition-transform shadow-[0_0_30px_rgba(253,228,3,0.3)]"
        >
          Записатися на сервіс
        </Link>
      </div>
    </section>
  );
}

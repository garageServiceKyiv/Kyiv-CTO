import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover opacity-40 grayscale"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAye_tWXV2yx5bRyjte2q0Kknk-5PVIDRWIk6V0qMMB74JxV6TlT8Y3_Eve_vq3PS3RToVikv2kqEzzLvF35cuM8c8nhOSoPGbm2-LHKEy82EgPEwS4WKJi2LDViCV_egSMvETUt6EKs354HgMCBtiBNWAA9rK9Iiu4Trf7-MzSqKYVfRJi7qY94yxJ0608beca8iP_D07IhZ8LMdkvUO0-8-Bt0g7MBvEhwHBYF8ZD6XyWwu2pNnEwaD9Q6cLvAu33Qir-kRW1les"
          alt="Автосервіс"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      <div className="container mx-auto px-6 lg:px-10 relative z-10">
        <div className="max-w-4xl">
          <div className="inline-block py-1 px-3 bg-secondary/10 border border-secondary/20 mb-6">
            <span className="font-headline text-xs text-secondary tracking-widest uppercase">
              Auto Service Garage // Київ, Оболонь
            </span>
          </div>
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-none mb-8">
            Професійне СТО —{" "}
            <br />
            <span className="text-primary-container italic">
              Твій автомобіль у надійних руках.
            </span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-xl mb-10">
            Сучасне діагностичне обладнання, досвідчені інженери та гарантія на всі роботи. Ми не просто ремонтуємо — ми відновлюємо заводську досконалість.
          </p>
          <div className="flex flex-wrap gap-6 items-center">
            <Link
              href="/contacts#form"
              className="bg-primary-container text-on-primary font-headline text-base lg:text-lg font-black uppercase px-8 lg:px-10 py-4 tracking-widest shadow-[0_0_20px_rgba(253,228,3,0.3)] hover:scale-105 transition-transform duration-200"
            >
              Записатися на сервіс
            </Link>
            <div className="flex gap-12 border-l border-white/10 pl-8 ml-4">
              <div>
                <div className="font-headline text-2xl font-bold text-white">15+</div>
                <div className="font-headline text-[10px] text-white/40 uppercase tracking-[0.2em]">
                  років досвіду
                </div>
              </div>
              <div>
                <div className="font-headline text-2xl font-bold text-white text-glow">5000+</div>
                <div className="font-headline text-[10px] text-white/40 uppercase tracking-[0.2em]">
                  клієнтів
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

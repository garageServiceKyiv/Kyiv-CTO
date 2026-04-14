"use client";

import { useState, type FormEvent } from "react";

const SERVICES = [
  "Діагностика",
  "Ремонт двигуна",
  "Ходова частина",
  "Гальмівна система",
  "Технічне обслуговування",
  "Електрика",
  "Інше",
];

export default function ContactFormSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      car: (form.elements.namedItem("car") as HTMLInputElement).value,
      service: (form.elements.namedItem("service") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
        setShowModal(true);
      } else {
        const body = await res.json();
        setErrorMsg(body.error || "Помилка відправки");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Мережева помилка. Спробуйте пізніше.");
      setStatus("error");
    }
  }

  const inputClass =
    "w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 text-white placeholder-white/30 focus:border-secondary focus:outline-none font-body text-sm";

  return (
    <>
    <div className="bg-surface-container p-8 lg:p-10 relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="font-headline text-3xl font-black uppercase mb-2">
          Запит на діагностику
        </h2>
        <p className="text-on-surface-variant text-sm mb-10">
          Заповніть форму і ми зв&apos;яжемося з вами найближчим часом.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-[10px] font-headline text-on-surface-variant uppercase tracking-widest mb-2">
                Ваше ім&apos;я *
              </label>
              <input type="text" id="name" name="name" required className={inputClass} placeholder="Іван Петров" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-[10px] font-headline text-on-surface-variant uppercase tracking-widest mb-2">
                Телефон *
              </label>
              <input type="tel" id="phone" name="phone" required className={inputClass} placeholder="+380..." />
            </div>
          </div>

          <div>
            <label htmlFor="car" className="block text-[10px] font-headline text-on-surface-variant uppercase tracking-widest mb-2">
              Марка та модель авто
            </label>
            <input type="text" id="car" name="car" className={inputClass} placeholder="BMW 320d, 2019" />
          </div>

          <div>
            <label htmlFor="service" className="block text-[10px] font-headline text-on-surface-variant uppercase tracking-widest mb-2">
              Послуга
            </label>
            <select id="service" name="service" className={inputClass}>
              <option value="">Оберіть послугу</option>
              {SERVICES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-[10px] font-headline text-on-surface-variant uppercase tracking-widest mb-2">
              Повідомлення
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Опишіть хвилюючі вас проблеми..."
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-primary-container text-on-primary font-headline font-black uppercase tracking-widest py-4 text-base hover:bg-primary-dim transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "Відправка..." : "Відправити заявку"}
          </button>

          {status === "success" && (
            <p className="text-center text-secondary font-headline text-sm uppercase">
              Заявку відправлено! Ми зателефонуємо вам найближчим часом.
            </p>
          )}
          {status === "error" && (
            <p className="text-center text-tertiary font-headline text-sm uppercase">
              {errorMsg}
            </p>
          )}
        </form>
      </div>
    </div>

    {/* Success Modal */}
    {showModal && (
      <div
        className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center px-6"
        onClick={() => setShowModal(false)}
      >
        <div
          className="bg-surface-container border border-outline-variant/20 p-10 max-w-md w-full text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-5xl mb-4">✅</div>
          <h3 className="font-headline text-2xl font-black uppercase tracking-tight text-primary-container mb-3">
            Заявку відправлено!
          </h3>
          <p className="text-on-surface-variant text-sm mb-8">
            Ми зателефонуємо вам найближчим часом.
          </p>
          <button
            onClick={() => setShowModal(false)}
            className="bg-primary-container text-on-primary font-headline font-bold uppercase tracking-widest text-sm px-10 py-3 hover:bg-primary-dim transition-colors"
          >
            Добре
          </button>
        </div>
      </div>
    )}
    </>
  );
}

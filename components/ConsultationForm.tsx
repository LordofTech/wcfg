"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { MARQUES, type Marque } from "@/lib/brands";
import { luxuryEase } from "@/lib/motion";

const STEPS = [
  "Full Name",
  "WhatsApp / Phone",
  "Desired Marque",
  "Budget Range",
  "Delivery Location",
] as const;

const BUDGET_RANGES = [
  "Under $100K",
  "$100K to $250K",
  "$250K to $500K",
  "$500K to $1M",
  "$1M+",
  "Flexible / Upon Advice",
] as const;

const DELIVERY_LOCATIONS = ["U.S", "International"] as const;

interface FormData {
  fullName: string;
  phone: string;
  marque: Marque | "";
  budget: string;
  location: string;
}

const initialData: FormData = {
  fullName: "",
  phone: "",
  marque: "",
  budget: "",
  location: "",
};

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export default function ConsultationForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const progress = ((step + 1) / STEPS.length) * 100;

  const canAdvance = (): boolean => {
    switch (step) {
      case 0:
        return data.fullName.trim().length >= 2;
      case 1:
        return data.phone.trim().length >= 7;
      case 2:
        return data.marque !== "";
      case 3:
        return data.budget !== "";
      case 4:
        return data.location !== "";
      default:
        return false;
    }
  };

  const goNext = () => {
    if (!canAdvance()) {
      setError("Please complete this step to continue.");
      return;
    }
    setError("");
    setDirection(1);
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setError("");
    setDirection(-1);
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canAdvance() || submitting) {
      if (!canAdvance()) {
        setError("Please complete this step to continue.");
      }
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName.trim(),
          phone: data.phone.trim(),
          marque: data.marque,
          budget: data.budget,
          deliveryLocation: data.location,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string }
        | null;

      if (!response.ok || !payload?.success) {
        setError(
          payload?.error ??
            "We could not submit your request. Please try again."
        );
        return;
      }

      setSubmitted(true);
    } catch {
      setError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="consultation" className="scroll-mt-28 px-6 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: luxuryEase }}
            className="glass-strong rounded-sm border border-gold-light/25 px-8 py-14 text-center md:px-12"
          >
            <CheckCircle2
              className="mx-auto text-gold-light"
              size={40}
              strokeWidth={1.25}
              aria-hidden
            />
            <h2 className="mt-6 font-display text-3xl font-medium tracking-wide text-ivory">
              Request Received
            </h2>
            <p className="mt-4 font-sans text-sm font-light leading-relaxed text-mist">
              Thank you, {data.fullName.split(" ")[0]}. Your white-glove sourcing
              request has been initiated. A WCFG advisor will reach you shortly
              via WhatsApp or phone to begin the consultation.
            </p>
            <div className="divider-gold mx-auto my-8 w-24" />
            <p className="font-sans text-xs font-light uppercase tracking-luxury text-gold-light">
              Your Vision · Our Network · The Perfect Vehicle
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="consultation" className="relative scroll-mt-28 px-6 py-24 md:px-8 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gold-radial opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-2xl">
        <SectionHeading
          eyebrow="Complimentary Consultation"
          title="Let's Find Your Next Dream Car"
          description="Share a few details and initiate white-glove sourcing. We handle the search, negotiation, and delivery. You enjoy the experience."
        />

        <form
          onSubmit={handleSubmit}
          className="glass-strong overflow-hidden rounded-sm border border-gold-light/20"
          noValidate
        >
          {/* Progress */}
          <div className="border-b border-gold-light/10 px-6 py-5 md:px-8">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="font-sans text-[10px] font-light uppercase tracking-luxury text-gold-light">
                Step {step + 1} of {STEPS.length}
              </p>
              <p className="font-sans text-[10px] font-light uppercase tracking-luxury text-mist">
                {STEPS[step]}
              </p>
            </div>
            <div
              className="h-1 overflow-hidden rounded-full bg-charcoal-soft"
              role="progressbar"
              aria-valuenow={step + 1}
              aria-valuemin={1}
              aria-valuemax={STEPS.length}
              aria-label="Form progress"
            >
              <motion.div
                className="h-full bg-gold-gradient"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: luxuryEase }}
              />
            </div>
            <ol className="mt-4 hidden gap-1 sm:flex" aria-hidden>
              {STEPS.map((label, index) => (
                <li
                  key={label}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    index <= step ? "bg-gold-light/70" : "bg-charcoal-soft"
                  }`}
                />
              ))}
            </ol>
          </div>

          <div className="relative min-h-[280px] overflow-hidden px-6 py-8 md:px-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: luxuryEase }}
              >
                {step === 0 && (
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light"
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      value={data.fullName}
                      onChange={(event) =>
                        setData((prev) => ({ ...prev, fullName: event.target.value }))
                      }
                      placeholder="Enter your full name"
                      className="mt-4 w-full border border-gold-light/20 bg-pitch/60 px-4 py-3.5 font-sans text-sm font-light text-ivory placeholder:text-mist/50 outline-none transition-colors focus:border-gold-light/50 focus:ring-1 focus:ring-gold-light/40"
                    />
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <label
                      htmlFor="phone"
                      className="block font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light"
                    >
                      WhatsApp / Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={data.phone}
                      onChange={(event) =>
                        setData((prev) => ({ ...prev, phone: event.target.value }))
                      }
                      placeholder="+234 or +1 …"
                      className="mt-4 w-full border border-gold-light/20 bg-pitch/60 px-4 py-3.5 font-sans text-sm font-light text-ivory placeholder:text-mist/50 outline-none transition-colors focus:border-gold-light/50 focus:ring-1 focus:ring-gold-light/40"
                    />
                    <p className="mt-3 font-sans text-xs font-light text-mist">
                      Prefer WhatsApp for fastest concierge response.
                    </p>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <p
                      id="marque-label"
                      className="font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light"
                    >
                      Desired Marque
                    </p>
                    <div
                      className="mt-4 flex flex-wrap gap-2"
                      role="group"
                      aria-labelledby="marque-label"
                    >
                      {MARQUES.map((marque) => {
                        const active = data.marque === marque;
                        return (
                          <button
                            key={marque}
                            type="button"
                            aria-pressed={active}
                            onClick={() =>
                              setData((prev) => ({ ...prev, marque }))
                            }
                            className={`rounded-sm border px-4 py-2.5 font-sans text-[10px] font-light uppercase tracking-luxury transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 ${
                              active
                                ? "border-gold-light/50 bg-gold-gradient text-pitch"
                                : "border-gold-light/20 bg-pitch/40 text-mist hover:border-gold-light/40 hover:text-gold-light"
                            }`}
                          >
                            {marque}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <p
                      id="budget-label"
                      className="font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light"
                    >
                      Budget Range
                    </p>
                    <div
                      className="mt-4 grid gap-2 sm:grid-cols-2"
                      role="group"
                      aria-labelledby="budget-label"
                    >
                      {BUDGET_RANGES.map((range) => {
                        const active = data.budget === range;
                        return (
                          <button
                            key={range}
                            type="button"
                            aria-pressed={active}
                            onClick={() =>
                              setData((prev) => ({ ...prev, budget: range }))
                            }
                            className={`rounded-sm border px-4 py-3 text-left font-sans text-xs font-light transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 ${
                              active
                                ? "border-gold-light/50 bg-gold-gradient text-pitch"
                                : "border-gold-light/20 bg-pitch/40 text-mist hover:border-gold-light/40 hover:text-gold-light"
                            }`}
                          >
                            {range}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <p
                      id="location-label"
                      className="font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light"
                    >
                      Delivery Location
                    </p>
                    <div
                      className="mt-4 grid gap-2 sm:grid-cols-2"
                      role="group"
                      aria-labelledby="location-label"
                    >
                      {DELIVERY_LOCATIONS.map((location) => {
                        const active = data.location === location;
                        return (
                          <button
                            key={location}
                            type="button"
                            aria-pressed={active}
                            onClick={() =>
                              setData((prev) => ({ ...prev, location }))
                            }
                            className={`rounded-sm border px-4 py-3 text-left font-sans text-xs font-light transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 ${
                              active
                                ? "border-gold-light/50 bg-gold-gradient text-pitch"
                                : "border-gold-light/20 bg-pitch/40 text-mist hover:border-gold-light/40 hover:text-gold-light"
                            }`}
                          >
                            {location}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {error ? (
              <p
                className="mt-4 rounded-sm border border-gold-highlight/30 bg-pitch/40 px-3 py-2.5 font-sans text-xs font-light leading-relaxed text-gold-highlight"
                role="alert"
              >
                {error}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-gold-light/10 px-6 py-5 md:px-8">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0 || submitting}
              className="inline-flex items-center gap-1.5 font-sans text-[11px] font-light uppercase tracking-luxury text-mist transition-colors hover:text-gold-light disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none focus-visible:text-gold-light"
            >
              <ChevronLeft size={16} strokeWidth={1.5} aria-hidden />
              Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-1.5 bg-gold-gradient px-6 py-3 font-sans text-[11px] font-medium uppercase tracking-luxury text-pitch transition-shadow hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
              >
                Continue
                <ChevronRight size={16} strokeWidth={1.5} aria-hidden />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="inline-flex min-w-[14rem] items-center justify-center bg-gold-gradient px-6 py-3 font-sans text-[11px] font-medium uppercase tracking-luxury text-pitch transition-shadow hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal disabled:cursor-wait disabled:opacity-70"
              >
                {submitting
                  ? "Submitting…"
                  : "Initiate White-Glove Sourcing"}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

"use client";

import { FormEvent, useMemo, useState } from "react";
import { COUNTRY_DIAL_CODES } from "@/lib/country-dial-codes";

interface VehicleInquiryFormProps {
  initialVehicleLabel?: string;
}

const DEFAULT_COUNTRY = "US";

export default function VehicleInquiryForm({
  initialVehicleLabel = "",
}: VehicleInquiryFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY);
  const [phoneLocal, setPhoneLocal] = useState("");
  const [vehicle, setVehicle] = useState(initialVehicleLabel);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const selectedCountry = useMemo(
    () => COUNTRY_DIAL_CODES.find((country) => country.code === countryCode),
    [countryCode]
  );

  const dialCode = selectedCountry?.dialCode ?? "+1";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhoneLocal = phoneLocal.replace(/\D/g, "");
    const trimmedPhone = `${dialCode}${trimmedPhoneLocal}`;
    const trimmedVehicle = vehicle.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhoneLocal || !trimmedVehicle) {
      setError("Please complete name, email, phone number, and selected vehicle.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (trimmedPhoneLocal.length !== 10) {
      setError("Please enter exactly 10 phone digits after the country code.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          vehicle: trimmedVehicle,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string }
        | null;

      if (!response.ok || !payload?.success) {
        setError(payload?.error ?? "Unable to send inquiry right now. Please try again.");
        return;
      }

      setSuccess(true);
      setFullName("");
      setEmail("");
      setPhoneLocal("");
      setCountryCode(DEFAULT_COUNTRY);
      setVehicle(initialVehicleLabel);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2200);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-strong rounded-sm border border-gold-light/20 p-6 md:p-8"
      noValidate
    >
      <div className="grid gap-5">
        <div>
          <label
            htmlFor="inquiry-name"
            className="font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light"
          >
            Full Name
          </label>
          <input
            id="inquiry-name"
            name="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="mt-2 w-full border border-gold-light/20 bg-pitch/60 px-4 py-3.5 font-sans text-sm font-light text-ivory placeholder:text-mist/50 outline-none transition-colors focus:border-gold-light/50 focus:ring-1 focus:ring-gold-light/40"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label
            htmlFor="inquiry-email"
            className="font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light"
          >
            Email Address
          </label>
          <input
            id="inquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full border border-gold-light/20 bg-pitch/60 px-4 py-3.5 font-sans text-sm font-light text-ivory placeholder:text-mist/50 outline-none transition-colors focus:border-gold-light/50 focus:ring-1 focus:ring-gold-light/40"
            placeholder="name@example.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="inquiry-country"
            className="font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light"
          >
            Country
          </label>
          <select
            id="inquiry-country"
            name="country"
            value={countryCode}
            onChange={(event) => setCountryCode(event.target.value)}
            className="mt-2 w-full border border-gold-light/20 bg-pitch/60 px-4 py-3.5 font-sans text-sm font-light text-ivory outline-none transition-colors focus:border-gold-light/50 focus:ring-1 focus:ring-gold-light/40"
            required
          >
            {COUNTRY_DIAL_CODES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name} ({country.dialCode})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="inquiry-phone"
            className="font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light"
          >
            Phone Number
          </label>
          <div className="mt-2 flex items-stretch overflow-hidden border border-gold-light/20 bg-pitch/60">
            <span className="inline-flex items-center border-r border-gold-light/20 px-4 font-sans text-sm font-light text-gold-light">
              {dialCode}
            </span>
          <input
            id="inquiry-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            value={phoneLocal}
            onChange={(event) =>
              setPhoneLocal(event.target.value.replace(/[^\d]/g, ""))
            }
            maxLength={10}
            className="w-full bg-transparent px-4 py-3.5 font-sans text-sm font-light text-ivory placeholder:text-mist/50 outline-none"
            placeholder="Enter 10 remaining phone digits"
            required
          />
          </div>
          <p className="mt-2 font-sans text-xs font-light text-mist/80">
            Select country code first, then enter the remaining number digits.
          </p>
        </div>

        <div>
          <label
            htmlFor="inquiry-vehicle"
            className="font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light"
          >
            Selected Vehicle
          </label>
          <input
            id="inquiry-vehicle"
            name="vehicle"
            type="text"
            value={vehicle}
            onChange={(event) => setVehicle(event.target.value)}
            className="mt-2 w-full border border-gold-light/20 bg-pitch/60 px-4 py-3.5 font-sans text-sm font-light text-ivory placeholder:text-mist/50 outline-none transition-colors focus:border-gold-light/50 focus:ring-1 focus:ring-gold-light/40"
            placeholder="e.g., 2024 Bentley Continental GT"
            required
          />
        </div>
      </div>

      {error ? (
        <p
          className="mt-5 rounded-sm border border-gold-highlight/30 bg-pitch/40 px-3 py-2.5 font-sans text-xs font-light leading-relaxed text-gold-highlight"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {success ? (
        <p
          className="mt-5 rounded-sm border border-gold-light/30 bg-pitch/40 px-3 py-2.5 font-sans text-xs font-light leading-relaxed text-gold-light"
          role="status"
        >
          Inquiry sent successfully. Our team will contact you shortly.
        </p>
      ) : null}

      {showCelebration ? (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="relative overflow-hidden rounded-sm border border-gold-light/40 bg-pitch/95 px-8 py-7 shadow-gold-lg">
            <div className="absolute -left-2 -top-2 h-3 w-3 rounded-full bg-gold-light animate-ping" />
            <div className="absolute right-3 -top-1 h-2 w-2 rounded-full bg-gold-highlight animate-ping [animation-delay:150ms]" />
            <div className="absolute -right-2 top-6 h-2.5 w-2.5 rounded-full bg-gold-light animate-ping [animation-delay:300ms]" />
            <div className="absolute left-5 -bottom-2 h-2.5 w-2.5 rounded-full bg-gold-highlight animate-ping [animation-delay:220ms]" />
            <div className="absolute right-8 -bottom-2 h-3 w-3 rounded-full bg-gold-light animate-ping [animation-delay:420ms]" />
            <p className="text-center font-display text-3xl font-medium tracking-wide text-gold-gradient">
              Congratulations!
            </p>
            <p className="mt-3 text-center font-sans text-sm font-light leading-relaxed text-mist">
              Inquiry sent successfully. Our team will contact you shortly.
            </p>
          </div>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex w-full items-center justify-center bg-gold-gradient px-6 py-3 font-sans text-[11px] font-medium uppercase tracking-luxury text-pitch transition-shadow hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal disabled:cursor-wait disabled:opacity-70"
      >
        {submitting ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}

"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import {
  getManufacturerOptions,
  getModelOptions,
  getYearOptions,
  type Vehicle,
} from "@/lib/inventory";

export interface InventoryFiltersProps {
  vehicles: Vehicle[];
  /** When set (brand pages), manufacturer is locked to this slug. */
  lockedManufacturer?: string | null;
  resultCount: number;
}

const selectClassName =
  "w-full appearance-none rounded-sm border border-gold-light/20 bg-pitch/80 px-3 py-2.5 pr-8 font-sans text-sm font-light text-ivory outline-none transition-colors hover:border-gold-light/40 focus:border-gold-light/50 focus:ring-1 focus:ring-gold-light/40 disabled:cursor-not-allowed disabled:opacity-50";

const labelClassName =
  "mb-1.5 block font-sans text-[10px] font-light uppercase tracking-luxury text-gold-light/90";

function readParam(params: URLSearchParams, key: string): string {
  return params.get(key)?.trim() ?? "";
}

export default function InventoryFilters({
  vehicles,
  lockedManufacturer = null,
  resultCount,
}: InventoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const manufacturerParam = lockedManufacturer
    ? lockedManufacturer
    : readParam(searchParams, "manufacturer");
  const modelParam = readParam(searchParams, "model");
  const yearParam = readParam(searchParams, "year");

  const manufacturers = useMemo(
    () => getManufacturerOptions(vehicles),
    [vehicles]
  );

  const manufacturer = useMemo(() => {
    if (!manufacturerParam) return "";
    const match = manufacturers.find(
      (option) => option.slug === manufacturerParam
    );
    return match?.slug ?? manufacturerParam;
  }, [manufacturerParam, manufacturers]);

  const models = useMemo(
    () => getModelOptions(vehicles, manufacturer || undefined),
    [vehicles, manufacturer]
  );

  const model = useMemo(() => {
    if (!modelParam) return "";
    const match = models.find(
      (option) => option.toLowerCase() === modelParam.toLowerCase()
    );
    return match ?? modelParam;
  }, [modelParam, models]);

  const years = useMemo(
    () => getYearOptions(vehicles, manufacturer || undefined, model || undefined),
    [vehicles, manufacturer, model]
  );

  const year = useMemo(() => {
    if (!yearParam) return "";
    return years.some((option) => String(option) === yearParam)
      ? yearParam
      : yearParam;
  }, [yearParam, years]);

  const hasActiveFilters = Boolean(
    (!lockedManufacturer && manufacturer) || model || year
  );

  const updateParams = useCallback(
    (next: { manufacturer?: string; model?: string; year?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      const nextManufacturer = lockedManufacturer
        ? lockedManufacturer
        : (next.manufacturer ?? manufacturer);
      const nextModel = next.model ?? model;
      const nextYear = next.year ?? year;

      if (lockedManufacturer) {
        params.delete("manufacturer");
      } else if (nextManufacturer) {
        params.set("manufacturer", nextManufacturer);
      } else {
        params.delete("manufacturer");
      }

      if (nextModel) {
        params.set("model", nextModel);
      } else {
        params.delete("model");
      }

      if (nextYear) {
        params.set("year", nextYear);
      } else {
        params.delete("year");
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [
      lockedManufacturer,
      manufacturer,
      model,
      year,
      pathname,
      router,
      searchParams,
    ]
  );

  const handleManufacturerChange = (value: string) => {
    const nextModels = getModelOptions(vehicles, value || undefined);
    const modelStillValid =
      value && model
        ? nextModels.some((m) => m.toLowerCase() === model.toLowerCase())
        : false;
    const keptModel = modelStillValid ? model : "";
    const nextYears = getYearOptions(
      vehicles,
      value || undefined,
      keptModel || undefined
    );
    const yearStillValid =
      year && nextYears.some((y) => String(y) === year);

    updateParams({
      manufacturer: value,
      model: keptModel,
      year: yearStillValid ? year : "",
    });
  };

  const handleModelChange = (value: string) => {
    const nextYears = getYearOptions(
      vehicles,
      manufacturer || undefined,
      value || undefined
    );
    const yearStillValid =
      year && nextYears.some((y) => String(y) === year);

    updateParams({
      model: value,
      year: yearStillValid ? year : "",
    });
  };

  const handleYearChange = (value: string) => {
    updateParams({ year: value });
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("manufacturer");
    params.delete("model");
    params.delete("year");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const countLabel =
    resultCount === 1 ? "1 vehicle" : `${resultCount} vehicles`;

  return (
    <div className="mb-10 rounded-sm border border-gold-light/15 bg-charcoal-velvet/50 p-4 backdrop-blur-sm md:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-sans text-[10px] font-light uppercase tracking-luxury text-mist">
          Filter inventory
        </p>
        <p
          className="font-sans text-sm font-light text-ivory"
          aria-live="polite"
        >
          {countLabel}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <div>
          <label htmlFor="filter-manufacturer" className={labelClassName}>
            Manufacturer
          </label>
          <div className="relative">
            <select
              id="filter-manufacturer"
              value={manufacturer}
              disabled={Boolean(lockedManufacturer)}
              onChange={(event) => handleManufacturerChange(event.target.value)}
              className={selectClassName}
              aria-label="Filter by manufacturer"
            >
              <option value="">All manufacturers</option>
              {manufacturers.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.name}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>

        <div>
          <label htmlFor="filter-model" className={labelClassName}>
            Model
          </label>
          <div className="relative">
            <select
              id="filter-model"
              value={model}
              onChange={(event) => handleModelChange(event.target.value)}
              className={selectClassName}
              aria-label="Filter by model"
            >
              <option value="">All models</option>
              {models.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>

        <div>
          <label htmlFor="filter-year" className={labelClassName}>
            Year
          </label>
          <div className="relative">
            <select
              id="filter-year"
              value={year}
              onChange={(event) => handleYearChange(event.target.value)}
              className={selectClassName}
              aria-label="Filter by year"
            >
              <option value="">All years</option>
              {years.map((option) => (
                <option key={option} value={String(option)}>
                  {option}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>

        <div className="flex sm:col-span-2 lg:col-span-1">
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-gold-light/25 px-4 py-2.5 font-sans text-[10px] font-medium uppercase tracking-luxury text-gold-light transition-colors hover:border-gold-light/45 hover:bg-gold-light/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-pitch disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X size={14} strokeWidth={1.5} aria-hidden />
            Clear filters
          </button>
        </div>
      </div>
    </div>
  );
}

function SelectChevron() {
  return (
    <span
      className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gold-light/70"
      aria-hidden
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M2.5 4.5L6 8L9.5 4.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

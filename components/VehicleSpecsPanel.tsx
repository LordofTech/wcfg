import type { VehicleSpecs } from "@/lib/vehicle-specs";

interface VehicleSpecsPanelProps {
  specs?: VehicleSpecs;
}

export default function VehicleSpecsPanel({ specs }: VehicleSpecsPanelProps) {
  if (!specs || (specs.overview.length === 0 && specs.equipment.length === 0)) {
    return null;
  }

  return (
    <section className="mt-16 border-t border-gold-light/10 pt-12">
      <div className="grid gap-10 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div>
          <p className="font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light">
            Vehicle Specifications
          </p>
          <h2 className="mt-2 font-display text-2xl text-ivory md:text-3xl">
            Full specification sheet
          </h2>

          {specs.overview.length > 0 ? (
            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              {specs.overview.map((item) => (
                <div
                  key={`${item.label}:${item.value}`}
                  className="rounded-sm border border-gold-light/10 bg-pitch/40 px-4 py-4"
                >
                  <dt className="font-sans text-[10px] font-light uppercase tracking-luxury text-mist/70">
                    {item.label}
                  </dt>
                  <dd className="mt-2 font-sans text-sm font-light leading-relaxed text-ivory">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        {specs.equipment.length > 0 ? (
          <div>
            <p className="font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light">
              Installed Equipment
            </p>
            <div className="mt-6 space-y-5">
              {specs.equipment.map((category) => (
                <section
                  key={category.title}
                  className="rounded-sm border border-gold-light/10 bg-pitch/30 p-5"
                >
                  <h3 className="font-sans text-[11px] font-medium uppercase tracking-luxury text-ivory">
                    {category.title}
                  </h3>
                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    {category.groups.map((group) => (
                      <div key={`${category.title}:${group.title}`}>
                        <p className="font-sans text-[10px] font-light uppercase tracking-luxury text-mist/70">
                          {group.title}
                        </p>
                        <ul className="mt-2 space-y-2 font-sans text-sm font-light leading-relaxed text-mist">
                          {group.items.map((item) => (
                            <li key={`${group.title}:${item}`} className="flex gap-2">
                              <span className="mt-[0.42rem] h-1 w-1 shrink-0 rounded-full bg-gold-light/70" aria-hidden />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

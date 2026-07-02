import { CompanyCard } from "../components/company-card";
import { companiesInfo } from "../data";

export default function CompaniesPage() {
  return (
    <div className="relative isolate min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-35 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(circle_at_top,black_0%,transparent_72%)]" />
      <div className="ambient-float pointer-events-none fixed -left-24 -top-32 -z-10 h-[30rem] w-[30rem] rounded-full bg-cyan-300/15 blur-3xl" />
      <div className="ambient-float-delayed pointer-events-none fixed bottom-0 left-0 -z-10 h-64 w-64 -translate-x-12 translate-y-10 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="ambient-float pointer-events-none fixed -right-12 top-40 -z-10 h-72 w-72 rounded-full bg-teal-300/15 blur-3xl" />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-14 pt-8 sm:px-8 sm:pt-12">
        <header className="reveal-up rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_30px_90px_-60px_rgba(14,165,233,0.75)] backdrop-blur-xl sm:p-8">
          <p className="inline-flex items-center rounded-full border border-cyan-200/25 bg-cyan-200/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100/90">
            Companies
          </p>
          <h1 className="mt-4 text-2xl font-semibold leading-tight text-slate-100 sm:text-4xl">
            Product companies actively hiring software talent.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            Explore enriched company profiles from the scraper dataset. Compare
            industries, customer segments, company size, and direct links to
            careers pages.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-xl border border-emerald-200/20 bg-emerald-200/10 px-3 py-1.5 font-semibold text-emerald-100">
              {companiesInfo.length} tracked companies
            </span>
            <span className="rounded-xl border border-slate-300/20 bg-slate-200/10 px-3 py-1.5 font-medium text-slate-300">
              Synced from scraper/data
            </span>
          </div>
        </header>

        <section className="grid gap-5 sm:gap-6">
          {companiesInfo.map((companyInfo, index) => (
            <div
              key={companyInfo.id}
              className="reveal-up"
              style={{ animationDelay: `${Math.min(index * 70, 500)}ms` }}
            >
              <CompanyCard companyInfo={companyInfo} />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

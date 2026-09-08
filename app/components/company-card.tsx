import Image from "next/image";
import { CompanyInfo } from "@/scraper/model/companies-model";
import { ArrowIcon } from "./icons/arrow-icon";
import { BriefcaseIcon } from "./icons/briefcase-icon";
import { BuildingIcon } from "./icons/building-icon";
import { CodeIcon } from "./icons/code-icon";
import { GlobeIcon } from "./icons/globe-icon";
import { MoneyIcon } from "./icons/money-icon";
import { MetaItem } from "./meta-item";

const getOverview = (companyInfo: CompanyInfo) => {
  if (companyInfo.overview) {
    return companyInfo.overview;
  }

  if (companyInfo.description.length > 0) {
    return companyInfo.description[0];
  }

  return "No company summary available.";
};

const formatFollowers = (followers: number) => {
  return `${followers.toLocaleString()} followers`;
};

const getWebsiteLabel = (website: string) => {
  return website.replace(/^https?:\/\//, "").replace(/^www\./, "");
};

export function CompanyCard({ companyInfo }: { companyInfo: CompanyInfo }) {
  const customersLabel = companyInfo.customerTypes.join(" • ");
  const overview = getOverview(companyInfo);
  const followersLabel = formatFollowers(companyInfo.followers);
  const websiteLabel = getWebsiteLabel(companyInfo.website);

  console.log(`${process.cwd()}/scraper/companies/logos/${companyInfo.id}.png`);
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_28px_80px_-52px_rgba(2,6,23,0.95)] backdrop-blur-xl transition duration-300 hover:border-cyan-200/25 hover:bg-white/[0.06] sm:p-6">
      <div className="pointer-events-none absolute -right-12 -top-20 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl transition duration-500 group-hover:bg-cyan-300/30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent" />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white p-2 shadow-lg shadow-slate-950/20">
            <Image
              src={`/api/company-logo/${encodeURIComponent(`${companyInfo.id}.png`)}`}
              alt={`${companyInfo.name} logo`}
              fill
              sizes="64px"
            />
          </div>
          <div className="min-w-0 space-y-2">
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-slate-100 sm:text-[1.85rem]">
              {companyInfo.name}
            </h2>
            <p className="inline-flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/20 bg-emerald-400/15 px-2.5 py-1 text-emerald-100">
                <BuildingIcon className="h-3.5 w-3.5" />
                {companyInfo.industry}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/20 bg-emerald-300/15 px-2.5 py-1 text-emerald-100">
                <CodeIcon className="h-3.5 w-3.5" />
                {companyInfo.technology}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200/20 bg-cyan-300/15 px-2.5 py-1 text-cyan-100">
                <BriefcaseIcon className="h-3.5 w-3.5" />
                {companyInfo.companySize}
              </span>
              <span className="rounded-full border border-amber-200/20 bg-amber-300/15 px-2.5 py-1 text-amber-100">
                Founded {companyInfo.foundedYear}
              </span>
            </p>
          </div>
        </div>

        <a
          href={companyInfo.website}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-200/35 bg-cyan-300/15 px-4 py-2.5 text-sm font-semibold text-cyan-50 transition hover:border-cyan-100/60 hover:bg-cyan-300/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/60"
        >
          Visit Website
          <ArrowIcon className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        <MetaItem
          icon={<GlobeIcon className="h-3.5 w-3.5" />}
          label="Website"
          value={websiteLabel}
        />
        <MetaItem
          icon={<BriefcaseIcon className="h-3.5 w-3.5" />}
          label="Customer types"
          value={customersLabel || "Not specified"}
        />
        <MetaItem
          icon={<MoneyIcon className="h-3.5 w-3.5" />}
          label="Followers"
          value={followersLabel}
        />
        <MetaItem
          icon={<BuildingIcon className="h-3.5 w-3.5" />}
          label="Industry"
          value={companyInfo.industry}
        />
      </div>

      <p className="mt-5 rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 text-sm leading-6 text-slate-300">
        {overview}
      </p>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <a
          href={companyInfo.listJobsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200 transition hover:border-cyan-200/35 hover:bg-cyan-300/15 hover:text-cyan-50"
        >
          Careers
          <ArrowIcon className="h-3.5 w-3.5" />
        </a>
        <a
          href={companyInfo.linkedinUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200 transition hover:border-cyan-200/35 hover:bg-cyan-300/15 hover:text-cyan-50"
        >
          LinkedIn
          <ArrowIcon className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}

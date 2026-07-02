import { NormalizedSoftwareJobInfo } from "@/scraper/model/jobs-model";
import { ArrowIcon } from "./icons/arrow-icon";
import { BriefcaseIcon } from "./icons/briefcase-icon";
import { BuildingIcon } from "./icons/building-icon";
import { CodeIcon } from "./icons/code-icon";
import { GlobeIcon } from "./icons/globe-icon";
import { MapPinIcon } from "./icons/map-pin-icon";
import { MoneyIcon } from "./icons/money-icon";
import { MetaItem } from "./meta-item";
import { companiesInfo } from "../data";
import { CATEGORIES_MAP, SENIORITY_MAP } from "@/scraper/jobs/map/job-info-map";

const getCompanyName = (companyId: string) => {
  const company = companiesInfo.find(({ id }) => id === companyId);
  return company ? company.name : "Unknown Company";
};

const formatSalary = (
  salaryRange: NormalizedSoftwareJobInfo["salaryRange"],
) => {
  if (!salaryRange) return "";
  const { min, max, currency } = salaryRange;
  return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
};

const getLocationSummary = (
  locations: NormalizedSoftwareJobInfo["locations"],
) => {
  if (!locations || locations.length === 0) return "Not specified";
  const locationLabels = locations.map((location) => {
    switch (location.scope) {
      case "worldwide":
        return "Worldwide";
      case "businessRegion":
        return location.businessRegion;
      case "continent":
        return location.continent;
      case "country":
        return location.country;
      case "state":
        return location.state;
      case "city":
        return location.city;
      default:
        return "";
    }
  });
  return locationLabels.join(" • ");
};

const getRemoteSummary = (jobListing: NormalizedSoftwareJobInfo) => {
  const remoteTypes = new Set<string>();
  jobListing.locations.forEach((location) => {
    if (location.workplaceType === "remote") {
      remoteTypes.add("Remote");
    } else if (location.workplaceType === "hybrid") {
      remoteTypes.add("Hybrid");
    } else if (location.workplaceType === "onsite") {
      remoteTypes.add("Onsite");
    }
  });
  return Array.from(remoteTypes).join(" • ") || "Not specified";
};

const getSeniorityLabel = (
  seniority: NormalizedSoftwareJobInfo["seniority"],
) => {
  return SENIORITY_MAP[seniority]?.seniorityLabel || "Not specified";
};

const getCategoryLabel = (category: NormalizedSoftwareJobInfo["category"]) => {
  return CATEGORIES_MAP[category]?.label || "Not specified";
};

export function JobCard({
  jobListing,
}: {
  jobListing: NormalizedSoftwareJobInfo;
}) {
  const companyName = getCompanyName(jobListing.companyId);
  const salaryLabel = formatSalary(jobListing.salaryRange);
  const locationLabel = getLocationSummary(jobListing.locations);
  const remoteLabel = getRemoteSummary(jobListing);
  const seniorityLabel = getSeniorityLabel(jobListing.seniority);
  const categoryLabel = getCategoryLabel(jobListing.category);

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_28px_80px_-52px_rgba(2,6,23,0.95)] backdrop-blur-xl transition duration-300 hover:border-cyan-200/25 hover:bg-white/[0.06] sm:p-6">
      <div className="pointer-events-none absolute -right-12 -top-20 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl transition duration-500 group-hover:bg-cyan-300/30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent" />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
            <BuildingIcon className="h-3.5 w-3.5" />
            {companyName}
          </p>
          <h2 className="text-2xl font-semibold leading-tight tracking-tight text-slate-100 sm:text-[1.85rem]">
            {jobListing.title}
          </h2>
          <p className="inline-flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/20 bg-emerald-300/15 px-2.5 py-1 text-emerald-100">
              <BriefcaseIcon className="h-3.5 w-3.5" />
              {seniorityLabel}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200/20 bg-cyan-300/15 px-2.5 py-1 text-cyan-100">
              <CodeIcon className="h-3.5 w-3.5" />
              {categoryLabel}
            </span>
            <span className="rounded-full border border-amber-200/20 bg-amber-300/15 px-2.5 py-1 text-amber-100">
              {jobListing.employmentType}
            </span>
          </p>
        </div>

        <a
          href={jobListing.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-200/35 bg-cyan-300/15 px-4 py-2.5 text-sm font-semibold text-cyan-50 transition hover:border-cyan-100/60 hover:bg-cyan-300/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/60"
        >
          View Job
          <ArrowIcon className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {salaryLabel && (
          <MetaItem
            icon={<MoneyIcon className="h-3.5 w-3.5" />}
            label="Salary"
            value={salaryLabel}
          />
        )}
        <MetaItem
          icon={<GlobeIcon className="h-3.5 w-3.5" />}
          label="Work setup"
          value={remoteLabel}
        />
        <MetaItem
          icon={<MapPinIcon className="h-3.5 w-3.5" />}
          label="Available in"
          value={locationLabel}
        />
        {jobListing.salaryRange && (
          <MetaItem
            icon={<BriefcaseIcon className="h-3.5 w-3.5" />}
            label="Perks"
            value={`${jobListing.salaryRange.bonus ? "Bonus" : "No Bonus"} • ${jobListing.salaryRange.equity ? "Equity" : "No Equity"}`}
          />
        )}
      </div>

      <p className="mt-5 rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 text-sm leading-6 text-slate-300">
        {jobListing.overview}
      </p>

      <div className="mt-5">
        <p className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
          <CodeIcon className="h-3.5 w-3.5" />
          Key skills
        </p>
        <div className="flex flex-wrap gap-2">
          {jobListing.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-semibold text-slate-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {jobListing.publishedAt
          ? `Posted ${new Date(jobListing.publishedAt).toLocaleDateString()}`
          : "Recently posted"}
      </p>
    </article>
  );
}

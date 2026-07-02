type MetaItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

export function MetaItem({ icon, label, value }: MetaItemProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/45 px-3 py-2.5">
      <p className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {icon}
        {label}
      </p>
      <p className="text-sm font-semibold leading-5 text-slate-100">{value}</p>
    </div>
  );
}

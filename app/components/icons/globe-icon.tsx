type IconProps = {
  className?: string;
};

export function GlobeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.4 3.75 5.4 3.75 9s-1.25 6.6-3.75 9c-2.5-2.4-3.75-5.4-3.75-9S9.5 5.4 12 3Z" />
    </svg>
  );
}

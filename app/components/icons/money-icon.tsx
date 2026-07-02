type IconProps = {
  className?: string;
};

export function MoneyIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path d="M3.75 7.5A2.25 2.25 0 0 1 6 5.25h12a2.25 2.25 0 0 1 2.25 2.25v9A2.25 2.25 0 0 1 18 18.75H6a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
      <circle cx="12" cy="12" r="2.625" />
      <path d="M6.75 9.75h.008v.008H6.75ZM17.242 14.242h.008v.008h-.008Z" />
    </svg>
  );
}

type IconProps = {
  className?: string;
};

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      className={className}
      aria-hidden="true"
    >
      <path d="M7.5 16.5 16.5 7.5" />
      <path d="M8.25 7.5h8.25v8.25" />
    </svg>
  );
}

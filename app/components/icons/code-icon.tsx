type IconProps = {
  className?: string;
};

export function CodeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path d="m9 18-6-6 6-6M15 6l6 6-6 6M13 4l-2 16" />
    </svg>
  );
}

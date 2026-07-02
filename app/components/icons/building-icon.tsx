type IconProps = {
  className?: string;
};

export function BuildingIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path d="M4.5 20.25V5.625A1.125 1.125 0 0 1 5.625 4.5h5.25A1.125 1.125 0 0 1 12 5.625V20.25" />
      <path d="M12 20.25V9.375A1.125 1.125 0 0 1 13.125 8.25h5.25A1.125 1.125 0 0 1 19.5 9.375V20.25" />
      <path d="M3 20.25h18" />
      <path d="M7.125 8.25h2.25M7.125 11.25h2.25M14.625 12h2.25M14.625 15h2.25" />
    </svg>
  );
}

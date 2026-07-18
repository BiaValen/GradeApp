function iconProps(className?: string) {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
}

export function PencilIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

export function TrashIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function ExclamationIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg
      {...iconProps(className)}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v6" stroke={filled ? "white" : "currentColor"} />
      <circle cx="12" cy="16.5" r="0.75" fill={filled ? "white" : "currentColor"} stroke="none" />
    </svg>
  );
}

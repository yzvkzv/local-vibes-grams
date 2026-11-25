// Ikon garis ala Instagram (stroke, 24x24).
type P = { className?: string };

function base(className?: string) {
  return {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
}

export function IconHome({ className }: P) {
  return (
    <svg {...base(className)}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

export function IconHomeFilled({ className }: P) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2.5 2.5 10v11.5h6v-6h7v6h6V10L12 2.5Z" />
    </svg>
  );
}

export function IconSearch({ className }: P) {
  return (
    <svg {...base(className)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8" />
    </svg>
  );
}

export function IconExplore({ className }: P) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  );
}

export function IconCreate({ className }: P) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

export function IconHeart({ className, filled }: P & { filled?: boolean }) {
  if (filled) {
    return (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="#ff3040" stroke="#ff3040" className={className} aria-hidden>
        <path d="M12 21s-7.5-4.6-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1.2 4.5 2.6l1 1.4 1-1.4C14 6.2 15.5 5 17.5 5 21 5 23 8.5 21.5 12c-2 4.4-9.5 9-9.5 9Z" />
      </svg>
    );
  }
  return (
    <svg {...base(className)}>
      <path d="M12 21s-7.5-4.6-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1.2 4.5 2.6l1 1.4 1-1.4C14 6.2 15.5 5 17.5 5 21 5 23 8.5 21.5 12c-2 4.4-9.5 9-9.5 9Z" />
    </svg>
  );
}

export function IconComment({ className }: P) {
  return (
    <svg {...base(className)}>
      <path d="M21 12a8 8 0 0 1-8 8H4l2.3-2.9A8 8 0 1 1 21 12Z" />
      <path d="M21 12a8 8 0 0 0-8-8" opacity="0" />
    </svg>
  );
}

export function IconShare({ className }: P) {
  return (
    <svg {...base(className)}>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </svg>
  );
}

export function IconMessenger({ className }: P) {
  return (
    <svg {...base(className)}>
      <path d="M21 12a8 8 0 0 1-8 8c-1.2 0-2.4-.3-3.4-.8L4 20l.8-5.6A8 8 0 1 1 21 12Z" />
      <path d="m8.5 11 2.5 2.5 4.5-4.5" />
    </svg>
  );
}

export function IconBookmark({ className }: P) {
  return (
    <svg {...base(className)}>
      <path d="M6 3h12v18l-6-4.5L6 21V3Z" />
    </svg>
  );
}

export function IconGrid({ className }: P) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="3" width="8" height="8" />
      <rect x="13" y="3" width="8" height="8" />
      <rect x="3" y="13" width="8" height="8" />
      <rect x="13" y="13" width="8" height="8" />
    </svg>
  );
}

export function IconLogout({ className }: P) {
  return (
    <svg {...base(className)}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5M21 12H9" />
    </svg>
  );
}

export function IconDots({ className }: P) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <circle cx="5" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="12" r="1.8" />
    </svg>
  );
}

export function IconVideo({ className }: P) {
  return (
    <svg {...base(className)}>
      <rect x="2" y="5" width="14" height="14" rx="3" />
      <path d="m16 10 6-3v10l-6-3" />
    </svg>
  );
}

interface BrandMarkProps {
  color?: string;
  size?: number;
}

export default function BrandMark({ color = '#E8A33D', size = 22 }: BrandMarkProps) {
  return (
    <svg
      width={size * 0.78}
      height={size}
      viewBox="0 0 78 100"
      fill={color}
      aria-hidden="true"
      className="nav-brand-mark"
    >
      <path d="M39 4 L48 26 L60 22 C58 36 50 44 39 44 C28 44 20 36 18 22 L30 26 Z" />
      <circle cx="39" cy="28" r="3.2" fill="#0B1410" />
      <path d="M39 70 C30 70 22 64 14 50 C26 50 34 56 39 64 C44 56 52 50 64 50 C56 64 48 70 39 70 Z" />
      <rect x="36.5" y="60" width="5" height="36" rx="2" />
    </svg>
  );
}

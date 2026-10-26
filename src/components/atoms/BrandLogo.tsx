interface BrandLogoProps {
  dotClassName: string;
}

// The "Ardial." wordmark from the section navs. Each section colours its own full stop.
export function BrandLogo({ dotClassName }: BrandLogoProps) {
  return (
    <svg viewBox="0 0 338 100" aria-hidden="true" focusable="false">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 80 39 18 66 80M23 57h32" />
        <path d="M82 80V43m0 15c4-12 13-18 25-15" />
        <path d="M157 18v62m0-26c-5-16-36-16-36 8s31 24 36 8" />
        <path d="M180 44v36M180 23v1" />
        <path d="M236 44v36m0-26c-5-16-36-16-36 8s31 24 36 8" />
        <path d="M261 18v53q0 9 10 9" />
      </g>
      <circle className={dotClassName} cx="302" cy="76" r="5" />
    </svg>
  );
}

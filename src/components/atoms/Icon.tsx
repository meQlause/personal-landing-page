type IconName = 'arrow-up-right' | 'arrow-up' | 'download' | 'copy';

const ICON_PATHS: Record<IconName, string> = {
  'arrow-up-right': 'M6 18 18 6M6 6h12v12',
  'arrow-up': 'M12 19V5M6 11l6-6 6 6',
  download: 'M12 4v11M7 10.5l5 5 5-5M5 20h14',
  copy: 'M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8',
};

interface IconProps {
  name: IconName;
}

// Decorative: the label is always on the link or button that holds the icon.
export function Icon({ name }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {name === 'copy' && <rect x="8" y="8" width="12" height="12" rx="2.5" />}
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

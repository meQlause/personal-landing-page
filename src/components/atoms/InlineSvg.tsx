interface InlineSvgProps {
  markup: string;
}

// Renders a decorative SVG file (imported with ?raw) as part of the page. Carries no content, so it is hidden from
// assistive tech.
export function InlineSvg({ markup }: InlineSvgProps) {
  return (
    <span
      className="svg-host"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: markup.trim() }}
    />
  );
}

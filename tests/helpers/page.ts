// WCAG contrast from computed colours: rgb(r, g, b) or color(srgb r g b ...) with 0 to 1 channels.
const WCAG = {
  threshold: 0.03928,
  lowSlope: 12.92,
  offset: 0.055,
  scale: 1.055,
  gamma: 2.4,
  red: 0.2126,
  green: 0.7152,
  blue: 0.0722,
  flare: 0.05,
} as const;
const SCALE = { byte: 255, unit: 1 } as const;

function linear(channel: number): number {
  return channel <= WCAG.threshold
    ? channel / WCAG.lowSlope
    : ((channel + WCAG.offset) / WCAG.scale) ** WCAG.gamma;
}

function luminance(colour: string): number {
  const scale = colour.startsWith('color(') ? SCALE.unit : SCALE.byte;
  const [red, green, blue] = (colour.match(/[\d.]+/g) ?? [])
    .slice(0, 3)
    .map((value) => linear(Number(value) / scale));
  return WCAG.red * red + WCAG.green * green + WCAG.blue * blue;
}

export function contrastRatio(foreground: string, background: string): number {
  const [light, dark] = [luminance(foreground), luminance(background)].sort(
    (first, second) => second - first,
  );
  return Number(((light + WCAG.flare) / (dark + WCAG.flare)).toFixed(2));
}

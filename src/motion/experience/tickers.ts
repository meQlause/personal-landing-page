import { EXPERIENCE } from './constants';
import type { ExperienceRuntime } from './runtime';

// The year's odometer and the tickers of each stop, ported from the mockup's 04-experience/script.js.

// The year odometer: the ones digit rolls continuously; each higher digit rolls only while the one below goes 9 → 0.
export function roll(runtime: ExperienceRuntime, year: number): void {
  const { base, units } = EXPERIENCE.odometer;
  Object.values(units).forEach((unit, strip) => {
    const position =
      unit === 1
        ? year % base
        : (Math.floor(year / unit) % base) + Math.max(0, (year % unit) - (unit - 1));
    runtime.strips[strip].style.transform = `translateY(${-position}em)`;
  });
}

// Repeats each ticker's list until one copy covers the ticker's width, so the loop never shows a gap. The duration scales
// with the length, so every ticker moves at the same speed.
function fillTicker(ticker: HTMLElement): void {
  const track = ticker.firstElementChild as HTMLElement;
  const [first, second] = [...track.children] as HTMLElement[];
  ticker.dataset.run ??= first.innerHTML;
  const run = ticker.dataset.run;
  first.innerHTML = run;
  // A fractional width (scrollWidth rounds) and one spare copy, so sub-pixel rounding never leaves a sliver of gap.
  const copies =
    Math.ceil(ticker.clientWidth / Math.max(1, first.getBoundingClientRect().width)) + 1;
  first.innerHTML = run.repeat(copies);
  second.innerHTML = run.repeat(copies);
  const seconds = first.getBoundingClientRect().width / EXPERIENCE.ticker.speed;
  track.style.animationDuration = `${seconds.toFixed(EXPERIENCE.ticker.decimals)}s`;
}

export function fillTickers(runtime: ExperienceRuntime): void {
  runtime.tickers.forEach(fillTicker);
}

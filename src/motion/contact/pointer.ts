import { gsap } from '../gsap';
import { CONTACT } from './constants';

const TUNING = CONTACT.magnet;
const PERCENT = 100;

// The pointer's room: the light follows it, the "You" dot and the chassis tilt toward it, and the email is magnetic.
// Ported from the mockup's 06-contact/script.js.

export interface Magnet {
  readonly youX: (value: number) => unknown;
  readonly youY: (value: number) => unknown;
  readonly tiltX: (value: number) => unknown;
  readonly tiltY: (value: number) => unknown;
  readonly mailX: (value: number) => unknown;
  readonly mailY: (value: number) => unknown;
}

export interface Room {
  readonly stage: HTMLElement;
  readonly you: HTMLElement;
  readonly chassis: HTMLElement;
  readonly email: HTMLElement;
}

// Springs toward a value, the way the mockup's quickTo does; only fine pointers get them.
export function magnetFor(room: Room): Magnet {
  const tuning = TUNING;
  const quick = (
    element: Element,
    property: string,
    duration: number,
  ): ((value: number) => unknown) =>
    gsap.quickTo(element, property, { duration, ease: 'power3.out' }) as (value: number) => unknown;
  gsap.set(room.chassis, { transformPerspective: tuning.perspective });
  return {
    youX: quick(room.you, 'x', tuning.duration),
    youY: quick(room.you, 'y', tuning.duration),
    tiltX: quick(room.chassis, 'rotationX', tuning.tiltDuration),
    tiltY: quick(room.chassis, 'rotationY', tuning.tiltDuration),
    mailX: quick(room.email, 'x', tuning.slowDuration),
    mailY: quick(room.email, 'y', tuning.slowDuration),
  };
}

// The pointer moves the light, pulls the "You" dot by a capped distance, tilts the chassis and pulls the email.
// The pointer lights the room where it is, and moves the "You" dot, the chassis and the email toward it.
export function onPointer(room: Room, magnet: Magnet, event: PointerEvent): void {
  const shareX = lightRoom(room, event);
  const shareY =
    (event.clientY - room.stage.getBoundingClientRect().top) /
    room.stage.getBoundingClientRect().height;
  const youBounds = room.you.getBoundingClientRect();
  const offsetX = event.clientX - (youBounds.left + youBounds.width / 2);
  const offsetY = event.clientY - (youBounds.top + youBounds.height / 2);
  const distance = Math.hypot(offsetX, offsetY) || 1;
  const pull = Math.min(TUNING.limit, distance * TUNING.reach);
  magnet.youX((offsetX / distance) * pull);
  magnet.youY((offsetY / distance) * pull);
  magnet.tiltY((shareX - TUNING.centre) * TUNING.tiltY);
  magnet.tiltX(-(shareY - TUNING.tiltCentreY) * TUNING.tiltX);
  pullEmail(room, magnet, event);
}

// Sets the light's position on the stage, and returns the pointer's share across the stage's width.
function lightRoom(room: Room, event: PointerEvent): number {
  const stageBounds = room.stage.getBoundingClientRect();
  const shareX = (event.clientX - stageBounds.left) / stageBounds.width;
  const shareY = (event.clientY - stageBounds.top) / stageBounds.height;
  room.stage.style.setProperty('--mx', `${(shareX * PERCENT).toFixed(CONTACT.decimals)}%`);
  room.stage.style.setProperty('--my', `${(shareY * PERCENT).toFixed(CONTACT.decimals)}%`);
  return shareX;
}

// Over the email the address leans toward the pointer; anywhere else it rests.
// Over the email the address leans toward the pointer; anywhere else it rests.
function pullEmail(room: Room, magnet: Magnet, event: PointerEvent): void {
  const target = event.target instanceof Element ? event.target : null;
  if (target?.closest('.k-email')) {
    const bounds = room.email.getBoundingClientRect();
    magnet.mailX((event.clientX - bounds.left - bounds.width / 2) * TUNING.mailX);
    magnet.mailY((event.clientY - bounds.top - bounds.height / 2) * TUNING.mailY);
  } else {
    magnet.mailX(0);
    magnet.mailY(0);
  }
}

// The pointer has left: everything goes back to rest and the light is removed.
export function rest(room: Room, magnet: Magnet): void {
  magnet.youX(0);
  magnet.youY(0);
  magnet.tiltX(0);
  magnet.tiltY(0);
  magnet.mailX(0);
  magnet.mailY(0);
  room.stage.style.removeProperty('--mx');
  room.stage.style.removeProperty('--my');
}

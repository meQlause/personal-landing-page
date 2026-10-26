import { CONTACT } from './constants';
import { clamp, span } from './typing';

// The cable from the visitor's dot to the uplink plug, the handshake's packets riding it, and the link state of the ports.
// Ported from the mockup's 06-contact/script.js.

export interface Cable {
  readonly stage: HTMLElement;
  readonly wire: SVGSVGElement;
  readonly cable: SVGPathElement;
  readonly packet: SVGGElement;
  readonly packetText: SVGTextElement;
  readonly youDot: HTMLElement;
  readonly uplink: HTMLElement;
  readonly ports: HTMLElement[];
  readonly stateText: HTMLElement;
  readonly root: HTMLElement;
}

// The cable runs from the centre of the "You" dot, sagging down into the uplink plug, in stage pixels.
export function drawCable(cable: Cable): void {
  const stageBounds = cable.stage.getBoundingClientRect();
  const from = cable.youDot.getBoundingClientRect();
  const to = cable.uplink.getBoundingClientRect();
  const startX = from.left + from.width / 2 - stageBounds.left;
  const startY = from.top + from.height / 2 - stageBounds.top;
  const endX = to.left + to.width / 2 - stageBounds.left;
  const endY = to.top - stageBounds.top + CONTACT.cable.plugLift;
  const drop = Math.max(CONTACT.cable.dropMin, endY - startY);
  cable.wire.setAttribute('viewBox', `0 0 ${stageBounds.width} ${stageBounds.height}`);
  const sagY1 = startY + drop * CONTACT.cable.sag;
  const sagY2 = endY - drop * CONTACT.cable.rise;
  cable.cable.setAttribute(
    'd',
    `M${startX.toFixed(CONTACT.decimals)} ${startY.toFixed(CONTACT.decimals)}C${startX.toFixed(CONTACT.decimals)} ${sagY1.toFixed(CONTACT.decimals)} ${endX.toFixed(CONTACT.decimals)} ${sagY2.toFixed(CONTACT.decimals)} ${endX.toFixed(CONTACT.decimals)} ${endY.toFixed(CONTACT.decimals)}`,
  );
}

// The packet of the handshake in flight at this scroll, if any.
function flightAt(progress: number): (typeof CONTACT.packets)[number] | undefined {
  return CONTACT.packets.find((packet) => progress >= packet.from && progress <= packet.to);
}

// Moves the packet along the cable; hides it between packets.
export function placePacket(cable: Cable, progress: number, enabled: boolean): void {
  const flight = enabled ? flightAt(progress) : undefined;
  cable.root.classList.toggle('is-sending', flight !== undefined);
  if (!flight) {
    cable.packet.style.visibility = 'hidden';
    return;
  }
  const along = clamp(span(progress, flight.from, flight.to));
  const length = cable.cable.getTotalLength();
  const point = cable.cable.getPointAtLength(length * (flight.direction > 0 ? along : 1 - along));
  if (cable.packetText.textContent !== flight.label) {
    cable.packetText.textContent = flight.label;
  }
  cable.packet.setAttribute(
    'transform',
    `translate(${(point.x - CONTACT.packet.offsetX).toFixed(CONTACT.decimals)} ${(point.y - CONTACT.packet.offsetY).toFixed(CONTACT.decimals)})`,
  );
  cable.packet.style.visibility = 'visible';
}

const PORT_STEPS = Object.values(CONTACT.ports);
const STATE_CONNECTED = 'Connected. Pick a way in.';
const STATE_OPENING = 'Opening a connection';
const STATE_IDLE = 'Not connected yet';

// The link from scroll: the uplink comes up after the ACK, then each port in turn. Without motion everything is up.
export function setLink(cable: Cable, progress: number, enabled: boolean): void {
  const linked = !enabled || progress >= CONTACT.link;
  cable.root.classList.toggle('is-linked', linked);
  cable.ports.forEach((port, index) => {
    port.classList.toggle('is-up', !enabled || progress >= PORT_STEPS[index]);
  });
  let state = STATE_IDLE;
  if (linked) {
    state = STATE_CONNECTED;
  } else if (progress >= CONTACT.packets[0].from) {
    state = STATE_OPENING;
  }
  cable.stateText.textContent = state;
}

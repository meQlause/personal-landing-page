import type { Port } from '../../content/contact';

interface RouterPortProps {
  port: Port;
}

// One port of the router: its socket with the LED, the jack and the plug, then the name and the handle.
export function RouterPort({ port }: RouterPortProps) {
  return (
    <a
      className="k-port"
      href={port.href}
      target={port.external ? '_blank' : undefined}
      rel={port.external ? 'noopener noreferrer' : undefined}
    >
      <span className="k-socket" aria-hidden="true">
        <span className="k-led" />
        <span className="k-jack" />
        <span className="k-plug" />
      </span>
      <span className="k-name">{port.name}</span>
      <span className="k-handle">{port.handle}</span>
    </a>
  );
}

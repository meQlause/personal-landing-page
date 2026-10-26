import { CONTACT, PORTS } from '../../content/contact';
import { RouterPort } from './RouterPort';

// The router's chassis: its screws, the silk print with the link state, the ports and the uplink.
export function RouterChassis() {
  return (
    <div className="k-chassis">
      <span className="k-screw is-l" aria-hidden="true" />
      <span className="k-screw is-r" aria-hidden="true" />
      <div className="k-silk" aria-hidden="true">
        <span>{CONTACT.silk}</span>
        <span className="k-state">
          <span className="k-state-led" />
          <span className="k-state-text">Not connected yet</span>
        </span>
      </div>
      <ul className="k-ports" aria-label="Ways to reach Ardial">
        {PORTS.map((port) => (
          <li key={port.name}>
            <RouterPort port={port} />
          </li>
        ))}
      </ul>
      <div className="k-uplink" aria-hidden="true">
        <span className="k-socket">
          <span className="k-led" />
          <span className="k-jack" />
          <span className="k-plug" />
        </span>
        <span className="k-name">Uplink</span>
      </div>
    </div>
  );
}

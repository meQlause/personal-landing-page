import { CONTACT } from '../../content/contact';
import { Icon } from '../atoms/Icon';

// The address, a copy button for it, and the line that reports the copy.
export function MailBar() {
  return (
    <div className="k-mailbar">
      <a className="k-email" href={`mailto:${CONTACT.email}`}>
        {CONTACT.email}
      </a>
      <button
        className="k-copy"
        type="button"
        data-copy={CONTACT.email}
        aria-label="Copy email address"
      >
        <Icon name="copy" />
        <span className="k-copy-label">Copy</span>
      </button>
    </div>
  );
}

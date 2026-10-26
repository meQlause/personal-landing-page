import type { NavLink } from '../../content/nav';
import { Icon } from '../atoms/Icon';

interface NavLinksProps {
  links: readonly NavLink[];
}

export function NavLinks({ links }: NavLinksProps) {
  return (
    <nav aria-label="Main navigation">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          aria-current={link.current ? 'true' : undefined}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}
        >
          {link.label}
          {link.icon && (
            <>
              {' '}
              <Icon name={link.icon} />
            </>
          )}
        </a>
      ))}
    </nav>
  );
}

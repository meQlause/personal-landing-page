import type { NavLink } from '../../content/nav';
import { BrandLogo } from '../atoms/BrandLogo';
import { NavCharacterButton } from '../molecules/NavCharacterButton';
import { NavLinks } from '../molecules/NavLinks';

export interface SectionNavProps {
  prefix: 'work' | 'x' | 'c' | 'k';
  name: string;
  titleId?: string;
  nameTag: 'h2' | 'p';
  links: readonly NavLink[];
}

// The header every section shares: brand, section name, the nav character and the links.
export function SectionNav({ prefix, name, titleId, nameTag, links }: SectionNavProps) {
  const NameTag = nameTag;
  return (
    <header className={`${prefix}-nav`}>
      <a className={`${prefix}-brand`} href="#hero" aria-label="Ardial, back to beginning">
        <BrandLogo dotClassName={`${prefix}-dot`} />
      </a>
      <NameTag className={`${prefix}-section-name`} id={titleId}>
        {name}
      </NameTag>
      <NavCharacterButton />
      <NavLinks links={links} />
    </header>
  );
}

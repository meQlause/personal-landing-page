// Links in the section navs, as in the mockup headers. The icons are drawn by NavLinks.
export interface NavLink {
  label: string;
  href: string;
  icon?: 'arrow-up-right' | 'arrow-up';
  current?: boolean;
  external?: boolean;
}

const WORK: NavLink = { label: 'Work', href: '#work' };
const CONTACT: NavLink = {
  label: 'Contact',
  href: 'mailto:contact@ardial.my.id',
  icon: 'arrow-up-right',
};

export const HERO_NAV: readonly NavLink[] = [
  { label: 'Work', href: 'https://github.com/meQlause', external: true },
  CONTACT,
];

export const SECTION_NAV = {
  work: [{ ...WORK, current: true }, CONTACT],
  experience: [WORK, CONTACT],
  education: [WORK, CONTACT],
  contact: [WORK, { label: 'Top', href: '#hero', icon: 'arrow-up' }],
} as const satisfies Record<string, readonly NavLink[]>;

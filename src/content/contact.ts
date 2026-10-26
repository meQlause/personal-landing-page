// Contact: the router panel of ways in, the email, the CV and the copy. Copy as in the mockup's 06-contact/index.html.

export interface Port {
  readonly href: string;
  readonly name: string;
  readonly handle: string;
  readonly external: boolean;
}

export const CONTACT = {
  email: 'contact@ardial.my.id',
  kicker: 'Open to freelance and full-time work',
  headline: {
    label: 'What shall we build?',
    lead: 'What shall we ',
    alternates: ['build', 'ship', 'scale', 'launch', 'build'],
    end: '?',
  },
  sub: {
    before: 'Freelance work, a full-time role, or just an idea worth building. Plug into ',
    hint: 'a port below',
    after: ', or write to me directly.',
  },
  silk: 'RB-26, 4 ports',
  cv: { href: 'assets/Ardial-CV.pdf', label: 'PDF, 3 pages' },
  heartPath:
    'M12 21C5.5 16.3 1.5 12.6 1.5 7.6A5.4 5.4 0 0 1 12 5.3a5.4 5.4 0 0 1 10.5 2.3c0 5-4 8.7-10.5 13.4Z',
  credit: 'Ideas by me. Pixels with ',
};

export const PORTS: readonly Port[] = [
  {
    href: 'mailto:contact@ardial.my.id',
    name: 'Email',
    handle: 'contact@ardial.my.id',
    external: false,
  },
  { href: 'https://github.com/meQlause', name: 'GitHub', handle: '@meQlause', external: true },
  {
    href: 'https://www.linkedin.com/in/ardial',
    name: 'LinkedIn',
    handle: 'in/ardial',
    external: true,
  },
  {
    href: 'https://wa.me/6285291938316',
    name: 'WhatsApp',
    handle: '+62 852 9193 8316',
    external: true,
  },
];

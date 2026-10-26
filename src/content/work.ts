// Selected work: the five products, in the order of the tabs. Copy as in the mockup's 03-work/index.html.
export interface WorkProduct {
  readonly id: string;
  readonly tab: string;
  readonly before: string;
  readonly mark: string;
  readonly markClass: string;
  readonly after: string;
  readonly kind: string;
  readonly description: string;
  readonly href: string;
  readonly label: string;
}

export const PRODUCTS: readonly WorkProduct[] = [
  {
    id: 'simpul',
    tab: 'Simpul',
    before: 'Conversations become ',
    mark: 'action',
    markClass: 'mark-under',
    after: '.',
    kind: 'Operations coordination · AI routing',
    description:
      'A message in a busy group chat is labelled by AI, matched to a rule a manager wrote, routed to the role’s backup, and delivered to her phone.',
    href: 'https://simpul-landing.ardial.my.id',
    label: 'Visit Simpul',
  },
  {
    id: 'mnemo',
    tab: 'Mnemo',
    before: 'Ask what you ',
    mark: 'already wrote',
    markClass: 'mark-highlight',
    after: '.',
    kind: 'AI notes · answers from your own notes',
    description:
      'A question finds the relevant notes by meaning, the answer cites them, and a date in them becomes an event.',
    href: 'https://github.com/meQlause/mnemo',
    label: 'Source',
  },
  {
    id: 'treecord',
    tab: 'Treecord',
    before: 'Every tree, ',
    mark: 'proven',
    markClass: 'mark-circle',
    after: '.',
    kind: 'Tree survival evidence · on-chain payouts',
    description:
      'Six check-ins over 36 months, each signed on a phone under the tree; each pays the planter only if the tree is alive, with 40% held until month 36.',
    href: 'https://github.com/meQlause/treecord-frontend',
    label: 'Source',
  },
  {
    id: 'agaro',
    tab: 'Agaro-Vote',
    before: 'Put your ',
    mark: 'stake',
    markClass: 'mark-double',
    after: ' behind it.',
    kind: 'On-chain voting · committed tokens',
    description:
      'A voter commits tokens and votes: the option gains one count and the committed tokens, the poll’s hash chain gains a link, and rewards stream back while the tokens stay committed.',
    href: 'https://github.com/Agaro-Team/AgaroVote',
    label: 'Source',
  },
  {
    id: 'qswap',
    tab: 'QSwap',
    before: 'Liquidity in ',
    mark: 'motion',
    markClass: 'mark-wave',
    after: '.',
    kind: 'Uniswap-style exchange · constant product',
    description:
      'A token enters the pool, one reserve rises and the other falls so that x times y stays constant, and the other token comes out.',
    href: 'https://github.com/meQlause/Qswap',
    label: 'Source',
  },
];

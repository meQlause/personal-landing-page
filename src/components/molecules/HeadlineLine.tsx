import { Fragment } from 'react';
import type { EducationToken } from '../../content/education';
import { SelectedWord } from './SelectedWord';

interface HeadlineLineProps {
  tokens: readonly EducationToken[];
}

// A headline's words, with the key word in its selecting form. The spaces between them are kept as the mockup has them.
export function HeadlineLine({ tokens }: HeadlineLineProps) {
  return (
    <span className="c-line" aria-hidden="true">
      {tokens.map((token, index) => (
        <Fragment key={index}>
          {index > 0 ? ' ' : null}
          {token.kind === 'key' ? (
            <SelectedWord alternates={token.alternates} />
          ) : (
            <span className="c-word">{token.text}</span>
          )}
        </Fragment>
      ))}
    </span>
  );
}

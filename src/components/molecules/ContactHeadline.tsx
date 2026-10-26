import { CONTACT } from '../../content/contact';

// The headline: the typed lead, the key word that rolls through its alternates, and the question mark.
export function ContactHeadline() {
  const { headline } = CONTACT;
  return (
    <h2 className="k-headline" id="contact-title" aria-label={headline.label}>
      <span className="k-type" aria-hidden="true" data-text={headline.lead}>
        {headline.lead}
      </span>
      <span className="k-key" aria-hidden="true">
        <span className="k-roll">
          <span className="k-roll-in">
            {headline.alternates.map((alternate, index) => (
              <span
                key={index}
                className={index === 0 ? 'k-alt k-type' : 'k-alt'}
                data-text={index === 0 ? alternate : undefined}
              >
                {alternate}
              </span>
            ))}
          </span>
        </span>
        <span className="k-sel">
          <span className="k-roll">
            <span className="k-roll-in">
              {headline.alternates.map((alternate, index) => (
                <span key={index} className="k-alt">
                  {alternate}
                </span>
              ))}
            </span>
          </span>
        </span>
      </span>
      <span className="k-type" aria-hidden="true" data-text={headline.end}>
        {headline.end}
      </span>
    </h2>
  );
}

interface SelectedWordProps {
  alternates: readonly string[];
}

// The key word: its alternates rolled in one window, with a second copy in peach that sweeps across them by scroll.
export function SelectedWord({ alternates }: SelectedWordProps) {
  return (
    <span className="c-word c-key">
      <span className="c-roll">
        <span className="c-roll-in">
          {alternates.map((alternate) => (
            <span key={alternate} className="c-alt">
              {alternate}
            </span>
          ))}
        </span>
      </span>
      <span className="c-sel">
        <span className="c-roll">
          <span className="c-roll-in">
            {alternates.map((alternate) => (
              <span key={alternate} className="c-alt">
                {alternate}
              </span>
            ))}
          </span>
        </span>
      </span>
    </span>
  );
}

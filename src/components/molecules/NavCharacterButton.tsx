// The button that holds the nav character. The motion module draws the character into its SVG.
export function NavCharacterButton() {
  return (
    <button className="nav-prism" type="button" aria-label="Spin the little character" title="Spin">
      <span className="nav-prism-art" aria-hidden="true">
        <svg viewBox="0 0 100 100" />
      </span>
    </button>
  );
}

interface SplitCharsProps {
  text: string;
}

// A word as one span with a span per character, so the motion can rise and blur each letter in turn.
export function SplitChars({ text }: SplitCharsProps) {
  return (
    <span className="x-word">
      {[...text].map((char, index) => (
        <span key={index} className="x-char">
          {char}
        </span>
      ))}
    </span>
  );
}

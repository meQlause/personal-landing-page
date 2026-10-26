const YEAR = { digits: 4, cycle: 10 } as const;

// The year as four odometer digits. Each strip holds 0 to 9 and a 0 again, so it can roll on past 9 without a jump.
export function YearRoll() {
  const strip = [...Array(YEAR.cycle + 1).keys()].map((index) => index % YEAR.cycle);
  return (
    <div className="x-year-roll" aria-hidden="true">
      {[...Array(YEAR.digits).keys()].map((digit) => (
        <span key={digit} className="x-digit">
          <span className="x-strip">
            {strip.map((value, index) => (
              <span key={index}>{value}</span>
            ))}
          </span>
        </span>
      ))}
    </div>
  );
}

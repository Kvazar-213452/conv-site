export default function ToolStepHeading({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="tool-step-heading">
      <span className="tool-step-number" aria-hidden="true">
        {String(number).padStart(2, '0')}
      </span>
      <div className="tool-step-copy">
        <span className="tool-step-kicker">STEP {number}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

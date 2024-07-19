type PercentageProps = {
  value: number;
  decimals?: number;
};

export default function Percentage({
  value = 0,
  decimals = 0,
}: PercentageProps) {
  const output = (value * 100 * 10 ** decimals).toFixed(decimals);
  return <span>{output}%</span>;
}

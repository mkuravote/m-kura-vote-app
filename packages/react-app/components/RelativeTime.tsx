const formatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
});

const DIVISIONS: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
];

function formatTimeAgo(date: Date) {
  let duration = (date.getTime() - Date.now()) / 1000;
  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
}

type RelativeTimeProps = {
  date: Date;
  label?: string;
};

export default function RelativeTime({ date, label }: RelativeTimeProps) {
  if (label) {
    return (
      <span>
        {label} {formatTimeAgo(date)}
      </span>
    );
  }
  return <span>{formatTimeAgo(date)}</span>;
}

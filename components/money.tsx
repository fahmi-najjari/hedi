export function formatMoney(value: number | string) {
  return `${Number(value).toFixed(2)} TND`;
}

export function Money({ value }: { value: number | string }) {
  return (
    <span dir="ltr" className="inline-block whitespace-nowrap">
      {formatMoney(value)}
    </span>
  );
}

export function PriceWithUnit({
  value,
  unit,
}: {
  value: number | string;
  unit: string;
}) {
  return (
    <span dir="ltr" className="inline-block whitespace-nowrap">
      {formatMoney(value)} / {unit}
    </span>
  );
}

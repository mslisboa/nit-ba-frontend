import type { ReactNode } from "react";

type MetricCardProps = {
  value: number | string;
  label: string;
  detail?: string;
  icon?: ReactNode;
};

export function MetricCard({ value, label, detail, icon }: MetricCardProps) {
  return (
    <article className="metric-card">
      {icon ? <span className="icon-disc" aria-hidden="true">{icon}</span> : null}
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
        {detail ? <small>{detail}</small> : null}
      </div>
    </article>
  );
}

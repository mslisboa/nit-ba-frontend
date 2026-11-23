import type { ReactNode } from "react";

type StatusDotProps = {
  tone?: "ok" | "warn" | "neutral" | "danger";
  children: ReactNode;
};

export function StatusDot({ tone = "neutral", children }: StatusDotProps) {
  return <span className={`status-dot ${tone}`}>{children}</span>;
}

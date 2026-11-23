import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  tone?: "default" | "primary" | "muted";
};

export function Tag({ children, tone = "default" }: TagProps) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}

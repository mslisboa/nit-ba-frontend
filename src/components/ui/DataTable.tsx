import type { ReactNode } from "react";

type DataTableProps = {
  caption?: string;
  children: ReactNode;
};

export function DataTable({ caption, children }: DataTableProps) {
  return (
    <div className="compact-table" role="region" aria-label={caption}>
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      {children}
    </div>
  );
}

import type { ReactNode } from "react";

type FilterBarProps = {
  children: ReactNode;
  ariaLabel?: string;
};

export function FilterBar({ children, ariaLabel = "Filtros" }: FilterBarProps) {
  return (
    <form className="filter-bar" role="search" aria-label={ariaLabel}>
      {children}
    </form>
  );
}

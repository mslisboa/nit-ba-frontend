import Link from "next/link";
import type { ReactNode } from "react";

type BreadcrumbItem = {
  href?: string;
  label: ReactNode;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  ariaLabel?: string;
};

export function Breadcrumb({ items, ariaLabel = "Caminho da página" }: BreadcrumbProps) {
  return (
    <nav className="kit-breadcrumb" aria-label={ariaLabel}>
      {items.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
          {index < items.length - 1 ? (
            <span aria-hidden="true"> / </span>
          ) : null}
        </span>
      ))}
    </nav>
  );
}

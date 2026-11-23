"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AccessibilityToggle } from "@/components/navigation/AccessibilityToggle";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  count?: number;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    label: "Principal",
    items: [{ href: "/", label: "Início", icon: "⌂" }],
  },
  {
    label: "Ecossistema",
    items: [
      { href: "/nits", label: "NITs", icon: "N", count: 12 },
      { href: "/instituicoes", label: "Instituições", icon: "I", count: 12 },
      { href: "/territorios", label: "Territórios", icon: "T", count: 27 },
      { href: "/pesquisadores", label: "Pesquisadores", icon: "P" },
    ],
  },
  {
    label: "Inovação",
    items: [
      {
        href: "/propriedade-intelectual",
        label: "Propriedade intelectual",
        icon: "PI",
      },
    ],
  },
  {
    label: "Dados",
    items: [
      { href: "/indicadores", label: "Indicadores", icon: "↗" },
      { href: "/fontes", label: "Fontes e metodologia", icon: "F" },
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="sidebar-head">
        <Link className="brand" href="/" aria-label="Página inicial de NITs">
          <span className="brand-symbol" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            <strong>NITs</strong>
          </span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
        </button>
      </div>

      <nav
        id="main-nav"
        className={menuOpen ? "open" : undefined}
        aria-label="Navegação principal"
      >
        {navSections.map((section) => (
          <div key={section.label} className="nav-group">
            <span className="nav-section">{section.label}</span>
            {section.items.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? "active" : undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {typeof item.count === "number" ? <b>{item.count}</b> : null}
                </Link>
              );
            })}
          </div>
        ))}
        <AccessibilityToggle />
      </nav>
    </header>
  );
}

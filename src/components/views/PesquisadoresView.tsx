"use client";

import Link from "next/link";
import type { ResearcherListItem } from "@/types/pesquisador";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export function PesquisadoresView({ items }: { items: ResearcherListItem[] }) {
  return (
    <div className="card-grid" style={{ marginTop: 20 }}>
      {items.map((researcher) => (
        <article className="card" key={researcher.id} style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              aria-hidden="true"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "var(--surface-soft)",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                color: "var(--primary)",
              }}
            >
              {initials(researcher.nome)}
            </div>
            <h3 style={{ margin: 0 }}>
              <Link href={`/pesquisadores/${researcher.id}`}>{researcher.nome}</Link>
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>
            {researcher.instituicoes
              .map((link) => link.instituicao.sigla ?? link.instituicao.nome)
              .join(", ") || "Sem vínculo informado"}
          </p>
          <p style={{ margin: 0, fontSize: 12 }}>
            PIs: {researcher.total_propriedades_intelectuais}
          </p>
        </article>
      ))}
    </div>
  );
}

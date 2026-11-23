"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { InstitutionListItem } from "@/types/instituicao";

export function InstituicoesView({ items }: { items: InstitutionListItem[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const stored = window.localStorage.getItem("instituicoes-view");
    if (stored === "list" || stored === "grid") setView(stored);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("instituicoes-view", view);
  }, [view]);

  return (
    <>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginBottom: 12 }}>
        <button type="button" className={`button ${view === "grid" ? "" : "secondary"}`} onClick={() => setView("grid")}>Grade</button>
        <button type="button" className={`button ${view === "list" ? "" : "secondary"}`} onClick={() => setView("list")}>Lista</button>
      </div>

      {view === "list" ? (
        <div className="compact-table">
          <div className="table-row table-head">
            <span>Instituição</span>
            <span>NIT relacionado</span>
            <span>Territórios</span>
            <span>Pesquisadores</span>
            <span>PIs</span>
          </div>
          {items.map((institution) => (
            <div className="table-row" key={institution.id}>
              <span>
                <Link href={`/instituicoes/${institution.id}`}>
                  <b>{institution.nome}</b>
                </Link>
                {institution.sigla ? <small>{institution.sigla}</small> : null}
              </span>
              <span>
                {institution.nit ? (
                  <Link href={`/nits/${institution.nit.id}`}>{institution.nit.nome}</Link>
                ) : (
                  "Sem NIT identificado"
                )}
              </span>
              <span>{institution.territorios.map((t) => t.nome).join(", ") || "Não informado"}</span>
              <span>{institution.total_pesquisadores}</span>
              <span>{institution.total_propriedades_intelectuais}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-grid">
          {items.map((institution) => (
            <article className="card" key={institution.id}>
              <h3>
                <Link href={`/instituicoes/${institution.id}`}>{institution.nome}</Link>
              </h3>
              {institution.sigla ? <small>{institution.sigla}</small> : null}
              <p>{institution.nit ? `NIT: ${institution.nit.nome}` : "Sem NIT identificado"}</p>
              <p>{institution.territorios.map((t) => t.nome).join(", ") || "Não informado"}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

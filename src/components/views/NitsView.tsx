"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ValidationTag } from "@/components/ui/ValidationTag";
import type { NITListItem } from "@/types/nit";

export function NitsView({ items }: { items: NITListItem[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const stored = window.localStorage.getItem("nits-view");
    if (stored === "list" || stored === "grid") setView(stored);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("nits-view", view);
  }, [view]);

  return (
    <>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginBottom: 12 }}>
        <button
          type="button"
          className={`button ${view === "grid" ? "" : "secondary"}`}
          onClick={() => setView("grid")}
        >
          Grade
        </button>
        <button
          type="button"
          className={`button ${view === "list" ? "" : "secondary"}`}
          onClick={() => setView("list")}
        >
          Lista
        </button>
      </div>

      {view === "list" ? (
        <div className="compact-table">
          <div className="table-row table-head">
            <span>NIT</span>
            <span>Instituição</span>
            <span>Situação</span>
            <span>Territórios</span>
            <span>Status</span>
          </div>
          {items.map((nit) => (
            <div className="table-row" key={nit.id}>
              <span>
                <Link href={`/nits/${nit.id}`}>
                  <b>{nit.nome}</b>
                </Link>
                {nit.sigla ? <small>{nit.sigla}</small> : null}
              </span>
              <span>
                <b>{nit.instituicao.nome}</b>
                {nit.instituicao.sigla ? <small>{nit.instituicao.sigla}</small> : null}
              </span>
              <span>{nit.situacao ?? "Não informado"}</span>
              <span>
                {nit.territorios.length > 0
                  ? nit.territorios.map((t) => t.nome).join(", ")
                  : "Não informado"}
              </span>
              <span>
                {nit.status_validacao.length > 0 ? (
                  nit.status_validacao.map((status) => (
                    <ValidationTag key={status} status={status} />
                  ))
                ) : (
                  <span className="tag">Sem associação</span>
                )}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-grid">
          {items.map((nit) => (
            <article className="card" key={nit.id}>
              <h3>
                <Link href={`/nits/${nit.id}`}>{nit.nome}</Link>
              </h3>
              {nit.sigla ? <small>{nit.sigla}</small> : null}
              <p>{nit.instituicao.nome}</p>
              <p>{nit.situacao ?? "Não informado"}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

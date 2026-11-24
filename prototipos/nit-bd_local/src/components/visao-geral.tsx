import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./visao-geral.module.css";

export function FaixaGeral({ titulo, descricao, resumo, paginaMae }: {
  titulo: string;
  descricao?: string;
  resumo?: ReactNode;
  paginaMae?: { href: string; rotulo: string };
}) {
  return <section className={styles.faixa}>
    <nav className={styles.caminho} aria-label="Localização da página">
      <Link href="/">Início</Link>
      <span aria-hidden="true">/</span>
      {paginaMae && <>
        <Link href={paginaMae.href}>{paginaMae.rotulo}</Link>
        <span aria-hidden="true">/</span>
      </>}
      <span aria-current="page">{titulo}</span>
    </nav>
    <div className={styles.titulo}>
      <div><h1>{titulo}</h1>{descricao && <p>{descricao}</p>}</div>
      {resumo && <div className={styles.resumo}>{resumo}</div>}
    </div>
  </section>;
}

export function MedidaGeral({ id, icone, valor, rotulo, detalhe, fonte }: {
  id?: string; icone: string; valor: string; rotulo: string; detalhe: string; fonte: string;
}) {
  return <>
    <span className={styles.icone} aria-hidden="true">{icone}</span>
    <span className={styles.medidaTexto}>
      <strong id={id ? `${id}-valor` : undefined}>{valor}</strong>
      <b>{rotulo}</b>
      <span id={id ? `${id}-detalhe` : undefined}>{detalhe}</span>
      <small>{fonte}</small>
    </span>
  </>;
}

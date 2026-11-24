"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { navegacaoMvp, rotaAtiva } from "@/features/mvp/navigation";
import { Acessibilidade, VoltarAoTopo } from "./controles-leitura";
import styles from "./frame.module.css";

const icones = {
  inicio: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />,
  guia: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4m0 3h.01" /></>,
  rede: <><circle cx="12" cy="12" r="3" /><circle cx="5" cy="5" r="2" /><circle cx="19" cy="5" r="2" /><circle cx="12" cy="20" r="2" /><path d="m6.5 6.5 3.4 3.4m7.6-3.4-3.4 3.4M12 15v3" /></>,
  pessoas: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v3" /></>,
  pi: <><path d="M12 3 4 6v6c0 4 4 7 8 9 4-2 8-5 8-9V6l-8-3Z" /><path d="m8 12 3 3 5-6" /></>,
  fontes: <path d="M4 3v18h17M8 16v-5m5 5V7m5 9v-8" />,
};

function Icone({ nome }: { nome: keyof typeof icones }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true" focusable="false">{icones[nome]}</svg>;
}

export function Frame({ children, comAmostra, dataAmostra }: { children: ReactNode; comAmostra: boolean; dataAmostra: string }) {
  const path = usePathname();
  const [recolhida, setRecolhida] = useState(false);
  const [menuDaPagina, setMenuDaPagina] = useState<string | null>(null);
  const aberto = menuDaPagina === path;

  function alternarDados() {
    document.cookie = `jd-dados=${comAmostra ? "api" : "amostra"}; Path=/; SameSite=Lax; Max-Age=2592000`;
    window.location.reload();
  }

  return <>
    <a className={styles.pular} href="#conteudo">Ir para o conteúdo</a>
    <header className={styles.cabecalho}>
      <Link id="inicio-jd" className={styles.marcas} href="/" aria-label="Observatório de CT&I da Bahia · Início">
        <Image className={styles.governo} src="/logos/governo-bahia.jpeg" alt="Governo da Bahia · Secretaria de Ciência, Tecnologia e Inovação" width={142} height={50} unoptimized />
        <span className={styles.divisor} aria-hidden="true" />
        <Image className={styles.observatorio} src="/logos/observatorio.png" alt="Observatório" width={126} height={38} unoptimized />
        <Image className={styles.cti} src="/logos/observatorio-cti.png" alt="Observatório de CT&I da Bahia" width={150} height={40} unoptimized />
      </Link>
      <span className={styles.versao}>{comAmostra ? "Amostra do JD Local" : "JD Local · API"}</span>
      <div className={styles.acoes}>
        <Link className={styles.recorte} href="/cobertura">
          <strong>{comAmostra ? "Data da amostra" : "Recorte baiano"}</strong>
          <small>{comAmostra ? dataAmostra.split("-").reverse().join("/") : "BADEPI v12 · INPI"}</small>
        </Link>
        <button className={styles.console} type="button" onClick={alternarDados}
          title={comAmostra ? "Consultar a API local do JD" : "Usar os dados públicos incluídos no protótipo"}>
          {comAmostra ? "Abrir sem amostra" : "Abrir com amostra"}
        </button>
      </div>
    </header>

    <div className={styles.layout} data-recolhida={recolhida}>
      <aside className={styles.lateral}>
        <div className={styles.lateralTopo}>
          <Link href="/" className={styles.marcaNit} aria-label="Início de NITs" title="Início de NITs">
            <Image src="/logos/nit.webp" alt="" width={38} height={42} unoptimized />
            <strong>NITs</strong>
          </Link>
          <button type="button" className={styles.recolher} aria-expanded={!recolhida} aria-controls="navegacao-jd"
            aria-label={recolhida ? "Expandir barra lateral" : "Recolher barra lateral"}
            title={recolhida ? "Expandir barra lateral" : "Recolher barra lateral"}
            onClick={() => setRecolhida(!recolhida)}>
            <span aria-hidden="true">{recolhida ? "›" : "‹"}</span>
          </button>
          <button type="button" className={styles.menuMobile} aria-expanded={aberto} aria-controls="navegacao-jd"
            onClick={() => setMenuDaPagina(aberto ? null : path)}>Menu</button>
        </div>
        <nav id="navegacao-jd" className={styles.navegacao} aria-label="Navegação principal" data-aberto={aberto}>
          {navegacaoMvp.map(grupo => <div key={grupo.titulo} className={styles.grupo}>
            <p>{grupo.titulo}</p>
            {grupo.links.map(({ href, label, icone }) => <Link key={href} href={href} title={recolhida ? label : undefined}
              aria-label={label} aria-current={rotaAtiva(path, href) ? "page" : undefined} onClick={() => setMenuDaPagina(null)}>
              <span className={styles.navIcone}><Icone nome={icone} /></span>
              <span className={styles.navTexto}>{label}</span>
            </Link>)}
          </div>)}
        </nav>
        <Acessibilidade />
        <div className={styles.ambiente}>JD LOCAL</div>
      </aside>
      <div className={`workspace ${styles.conteudo}`}>
        <main id="conteudo" tabIndex={-1}>{children}</main>
        <footer className={`module-footer ${styles.rodape}`}>
          <div><strong>Observatório de CT&I da Bahia</strong><small>Consulta local · fontes e dados do JD</small></div>
          <Link href="/cobertura">Fontes e cobertura</Link>
        </footer>
      </div>
    </div>
    <VoltarAoTopo />
  </>;
}

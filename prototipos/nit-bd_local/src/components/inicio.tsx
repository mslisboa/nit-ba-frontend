"use client";

import Link from "next/link";
import { useConsulta } from "@/hooks/use-consulta";
import { numero } from "@/lib/apresentacao";
import type { PresencaTerritorialData } from "@/lib/types";
import { PresencaTerritorial } from "./presenca-territorial";
import { MedidaGeral } from "./visao-geral";
import mapa from "@/lib/territorios-mapa.json";
import styles from "./inicio.module.css";
import geral from "./visao-geral.module.css";

function Indicador({ destino, valor, repetir, ...medida }: {
  destino: string; valor: string; repetir?: () => void;
  rotulo: string; icone: string; detalhe: string; fonte: string;
}) {
  return <article className={styles.indicador}>
    <Link className={`${geral.medida} ${styles.cartaoIndicador}`} href={destino}>
      <MedidaGeral {...medida} valor={valor} />
    </Link>
    {repetir && <button type="button" onClick={repetir}>Tentar novamente</button>}
  </article>;
}

function useTotal(caminho: string) {
  const separador = caminho.includes("?") ? "&" : "?";
  return useConsulta<{ total: number }>(`/api/jd/${caminho}${separador}por_pagina=1`);
}

function valorIndicador(total: number | undefined, erro?: string) {
  return total === undefined ? erro ? "Indisponível" : "…" : numero(total);
}

function Panorama() {
  const nits = useTotal("instituicoes?estrutura_documentada=true");
  const instituicoes = useTotal("instituicoes");
  const territorios = useConsulta<PresencaTerritorialData>("/api/jd/presenca-territorial");
  const patentes = useTotal("patentes");
  const programas = useTotal("pi-catalogos/PRG");
  const marcas = useTotal("pi-catalogos/MRC");
  const desenhos = useTotal("pi-catalogos/DI");
  const modalidades = [patentes, programas, marcas, desenhos];
  const falhasPi = modalidades.filter(modalidade => modalidade.erro);
  const totalPi = modalidades.every(modalidade => modalidade.data)
    ? modalidades.reduce((total, modalidade) => total + (modalidade.data?.total ?? 0), 0)
    : undefined;
  const totalTerritorios = territorios.data && new Set(territorios.data.items.map(item => item.territorio)).size;

  return <section className={styles.panorama} aria-labelledby="titulo-panorama">
    <h2 id="titulo-panorama">Panorama do recorte</h2>
    <div className={`${geral.gradeMedidas} ${styles.gradePanorama}`}>
      <Indicador rotulo="NITs" icone="NIT" destino="/instituicoes" detalhe="Instituições com NIT ou estrutura de inovação documentada" fonte="Cadastro institucional do JD"
        valor={valorIndicador(nits.data?.total, nits.erro)} repetir={nits.erro ? nits.repetir : undefined} />
      <Indicador rotulo="Instituições" icone="I" destino="/instituicoes" detalhe="Referências institucionais mapeadas" fonte="Cadastro institucional do JD"
        valor={valorIndicador(instituicoes.data?.total, instituicoes.erro)} repetir={instituicoes.erro ? instituicoes.repetir : undefined} />
      <Indicador rotulo="Territórios com presença" icone="BA" destino="/#presenca-territorial" detalhe="Com vínculo publicado de sede, campus ou unidade" fonte="Cadastro territorial do JD"
        valor={territorios.data ? `${totalTerritorios} de ${mapa.length}` : valorIndicador(undefined, territorios.erro)} repetir={territorios.erro ? territorios.repetir : undefined} />
      <Indicador rotulo="Pesquisadores" icone="P" destino="/pesquisadores" detalhe="Catálogo de pesquisadores pendente de integração" fonte="Fonte prevista · SIMCC" valor="A integrar" />
      <Indicador rotulo="Ativos de PI" icone="PI" destino="/propriedade-intelectual" detalhe="Pedidos de patentes, software, marcas e desenhos industriais no recorte baiano" fonte="BADEPI v12 · INPI"
        valor={valorIndicador(totalPi, falhasPi[0]?.erro)} repetir={falhasPi.length ? () => falhasPi.forEach(modalidade => modalidade.repetir()) : undefined} />
    </div>
  </section>;
}

export function Inicio() {
  return <div className={styles.inicio}>
    <section className={styles.hero}>
      <div>
        <h1>Ecossistema de inovação da Bahia</h1>
        <form className={styles.busca} action="/instituicoes" method="get" role="search">
          <label className={styles.campoBusca}>
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5" /></svg>
            <input aria-label="Buscar instituição, NIT ou campus" type="search" name="q" placeholder="Busque por NIT, instituição, campus ou município" maxLength={160} />
          </label>
          <button className="jd-button" type="submit">Explorar a base</button>
        </form>
      </div>
      <aside className={styles.destaqueTerritorial}>
        <div className={styles.orbita} aria-hidden="true">
          <i><span /></i><i><span /></i><i><span /></i><b>BA</b>
        </div>
        <strong>Um estado.<br />Muitas conexões.</strong>
        <p>{mapa.length} Territórios de Identidade para descobrir.</p>
        <a href="#presenca-territorial">Explorar os territórios</a>
      </aside>
    </section>
    <Panorama />
    <PresencaTerritorial id="presenca-territorial" />
  </div>;
}

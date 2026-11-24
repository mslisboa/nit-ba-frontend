"use client";

import { useId, useState, type ReactNode } from "react";
import { baseCatalogoPI, CatalogoPI, type FiltrosIniciaisPI, type ModalidadeCatalogo, type ReferenciaFiltroPI } from "@/components/patentes";
import { MedidaGeral } from "@/components/visao-geral";
import { useConsulta } from "@/hooks/use-consulta";
import { numero } from "@/lib/apresentacao";
import styles from "./visao-geral.module.css";

const principais = [
  ["PTN", "Patentes", "PT"], ["PRG", "Programas de computador", "SW"],
  ["MRC", "Marcas", "MR"], ["OUTRAS", "Outras PI", "+"],
] as const;
const outras = [
  ["DI", "Desenhos industriais", "DI"], ["IG", "Indicações geográficas", "IG"],
  ["TCI", "Topografias de circuitos integrados", "TCI"],
] as const;

type AreaPI = (typeof principais)[number][0];
type OutraPI = (typeof outras)[number][0];
type ContagemPI = { total: number; meta?: { estado_cobertura?: string } };
type IndicadorPI = { valor: string; detalhe: string };

function useContagemPI(modalidade: ModalidadeCatalogo, instituicao?: ReferenciaFiltroPI, ativo = true) {
  const params = new URLSearchParams({ por_pagina: "1" });
  if (instituicao) params.set("instituicao", instituicao.id);
  return useConsulta<ContagemPI>(ativo ? `${baseCatalogoPI(modalidade)}?${params}` : null);
}

function mostrarContagem(consulta: ReturnType<typeof useContagemPI>, detalhe: string): IndicadorPI {
  if (consulta.erro) return { valor: "Indisponível", detalhe };
  if (!consulta.data) return { valor: "…", detalhe };
  if (consulta.data.meta?.estado_cobertura === "SEM_ASSOCIACAO_INSTITUCIONAL_CONFIRMADA") {
    return { valor: "A confirmar", detalhe: "Vínculos institucionais sem confirmação" };
  }
  return { valor: numero(consulta.data.total), detalhe };
}

function CartaoModalidade({ rotulo, icone, indicador, selecionada, selecionar, painel }: {
  rotulo: string; icone: string; indicador: IndicadorPI; selecionada: boolean; selecionar: () => void; painel: string;
}) {
  const medidaId = useId();
  return <button type="button" className={styles.medida} aria-label={rotulo}
    aria-describedby={`${medidaId}-valor ${medidaId}-detalhe`}
    aria-pressed={selecionada} aria-controls={painel} onClick={selecionar}>
    <MedidaGeral id={medidaId} icone={icone} valor={indicador.valor} rotulo={rotulo} detalhe={indicador.detalhe} fonte="BADEPI v12 · INPI" />
  </button>;
}

export function ConsultaPI({ instituicao, modalidadeInicial, anoInicial, filtrosIniciais, somenteOutras = false, aviso, painelId }: {
  instituicao?: ReferenciaFiltroPI; modalidadeInicial?: ModalidadeCatalogo; anoInicial?: string; somenteOutras?: boolean;
  aviso?: ReactNode; filtrosIniciais?: FiltrosIniciaisPI; painelId?: string;
}) {
  const ehOutra = modalidadeInicial === "DI" || modalidadeInicial === "IG" || modalidadeInicial === "TCI";
  const [area, setArea] = useState<AreaPI | null>(somenteOutras || ehOutra ? "OUTRAS" : (modalidadeInicial ?? null));
  const [outra, setOutra] = useState<OutraPI | null>(ehOutra ? modalidadeInicial : (somenteOutras || instituicao ? "DI" : null));
  const idGerado = useId();
  const painel = painelId ?? idGerado;
  const modalidade = area === "OUTRAS" ? outra : area;
  const detalhe = instituicao ? "Pedidos da referência no recorte baiano" : "Pedidos no recorte baiano";
  const patentes = useContagemPI("PTN", instituicao, !somenteOutras);
  const programas = useContagemPI("PRG", instituicao, !somenteOutras);
  const marcas = useContagemPI("MRC", instituicao, !somenteOutras);
  const desenhos = useContagemPI("DI", instituicao);
  const indicacoes = useContagemPI("IG", instituicao);
  const topografias = useContagemPI("TCI", instituicao);
  const consultasOutras = [desenhos, indicacoes, topografias];
  const totalOutras = consultasOutras.reduce((total, consulta) => total + (consulta.data?.total ?? 0), 0);
  const outrasPendentes = consultasOutras.some(consulta =>
    consulta.data?.meta?.estado_cobertura === "SEM_ASSOCIACAO_INSTITUCIONAL_CONFIRMADA"
  );
  const indicadores = {
    PTN: mostrarContagem(patentes, detalhe),
    PRG: mostrarContagem(programas, detalhe),
    MRC: mostrarContagem(marcas, detalhe),
    DI: mostrarContagem(desenhos, detalhe),
    IG: mostrarContagem(indicacoes, detalhe),
    TCI: mostrarContagem(topografias, detalhe),
    OUTRAS: {
      valor: consultasOutras.some(consulta => consulta.erro) ? "Indisponível" :
        consultasOutras.every(consulta => consulta.data) ? numero(totalOutras) : "…",
      detalhe: outrasPendentes ? "Pedidos com vínculo confirmado no recorte baiano" : detalhe,
    },
  };

  return <>
    {!somenteOutras && <nav className={`${styles.gradeMedidas} ${styles.gradePi} ${styles.seletorPi}`} aria-label="Modalidades de propriedade intelectual">
      {principais.map(([codigo, rotulo, icone]) => <CartaoModalidade key={codigo} rotulo={rotulo} icone={icone}
        indicador={indicadores[codigo]} selecionada={area === codigo} selecionar={() => setArea(codigo)}
        painel={painel} />)}
    </nav>}
    {aviso}
    {area === "OUTRAS" && <nav className={`${styles.gradeMedidas} ${styles.seletorPi}`} aria-label="Outras propriedades intelectuais">
      {outras.map(([codigo, rotulo, icone]) => <CartaoModalidade key={codigo} rotulo={rotulo} icone={icone}
        indicador={indicadores[codigo]} selecionada={outra === codigo} selecionar={() => setOutra(codigo)}
        painel={painel} />)}
    </nav>}
    <div id={painel}>
      {modalidade && <CatalogoPI key={modalidade} modalidade={modalidade} instituicaoPerfil={instituicao}
        tituloSecundario anoInicial={modalidade === modalidadeInicial ? anoInicial : undefined}
        filtrosIniciais={modalidade === modalidadeInicial ? filtrosIniciais : undefined} />}
    </div>
  </>;
}

export function OutrasPI() {
  return <ConsultaPI somenteOutras />;
}

export function PerfilPI({ instituicao, modalidadeInicial = "PTN", anoInicial }: {
  instituicao: ReferenciaFiltroPI; modalidadeInicial?: ModalidadeCatalogo; anoInicial?: string;
}) {
  return <section className="jd-panel jd-pi" id="propriedade-intelectual" aria-labelledby="titulo-pi">
    <h2 id="titulo-pi">Propriedade intelectual</h2>
    <ConsultaPI instituicao={instituicao} modalidadeInicial={modalidadeInicial} anoInicial={anoInicial} />
  </section>;
}

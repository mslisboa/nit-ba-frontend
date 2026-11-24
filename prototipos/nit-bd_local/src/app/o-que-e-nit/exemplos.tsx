"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { exemplos, referencias } from "./conteudo";
import styles from "./guia.module.css";

const porGrupo = 4;
const grupos = Array.from({ length: Math.ceil(exemplos.length / porGrupo) }, (_, indice) =>
  exemplos.slice(indice * porGrupo, (indice + 1) * porGrupo)
);
const consultaMovimento = "(prefers-reduced-motion: reduce)";
const movimentoReduzido = () => window.matchMedia(consultaMovimento).matches;
function observarMovimento(ouvinte: () => void) {
  const preferencia = window.matchMedia(consultaMovimento);
  preferencia.addEventListener("change", ouvinte);
  return () => preferencia.removeEventListener("change", ouvinte);
}

export function ExemplosNit() {
  const [grupo, setGrupo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [aviso, setAviso] = useState("");
  const regiao = useRef<HTMLDivElement>(null);
  const reduzir = useSyncExternalStore(observarMovimento, movimentoReduzido, () => true);
  const intervalo = (indice: number) =>
    `${indice * porGrupo + 1}–${Math.min((indice + 1) * porGrupo, exemplos.length)} de ${exemplos.length} exemplos`;

  useEffect(() => {
    const elemento = regiao.current;
    if (!elemento || pausado || reduzir) return;
    let visivel = false;
    const observador = new IntersectionObserver(([entrada]) => { visivel = entrada.isIntersecting; }, { threshold: .15 });
    observador.observe(elemento);
    const timer = window.setInterval(() => {
      if (visivel && !document.hidden && !elemento.contains(document.activeElement) && !elemento.matches(":hover")) {
        setGrupo(atual => (atual + 1) % grupos.length);
      }
    }, 6500);
    return () => { observador.disconnect(); window.clearInterval(timer); };
  }, [pausado, reduzir]);

  function mostrar(indice: number) {
    const proximo = (indice + grupos.length) % grupos.length;
    setGrupo(proximo);
    setAviso(`Exibindo ${intervalo(proximo)}.`);
  }

  return <div ref={regiao} className={styles.carrossel} role="region" aria-roledescription="carrossel" aria-label="Exemplos de NITs na Bahia">
    <div className={styles.controles}>
      <span>{intervalo(grupo)}</span>
      <button type="button" disabled={reduzir} onClick={() => setPausado(atual => !atual)}>
        {reduzir ? "Movimento reduzido" : pausado ? "Reproduzir" : "Pausar"}
      </button>
    </div>
    <div className={styles.cartoes}>
      {grupos.map((itens, indice) => <div className={styles.grupo} key={indice} hidden={indice !== grupo} inert={indice !== grupo}
        role="group" aria-label={`Grupo ${indice + 1} de ${grupos.length}`}>
        {itens.map(item => <article key={item.referencia}>
          <Image src={`/logos/instituicoes/${item.logo}`} alt="" width={64} height={64} unoptimized />
          <div>
            <h3>{item.nome}</h3>
            <p>{item.descricao}</p>
            <a href={referencias[item.referencia].url} target="_blank" rel="noopener noreferrer">{item.rotuloFonte}</a>
          </div>
        </article>)}
      </div>)}
    </div>
    <div className={styles.controles}>
      <button type="button" onClick={() => mostrar(grupo - 1)}>Anterior</button>
      <div className={styles.paginas} role="group" aria-label="Escolher grupo de exemplos">
        {grupos.map((_, indice) => <button type="button" key={indice} aria-label={`Mostrar grupo ${indice + 1}`}
          aria-current={indice === grupo || undefined} onClick={() => mostrar(indice)}><span aria-hidden="true" /></button>)}
      </div>
      <button type="button" onClick={() => mostrar(grupo + 1)}>Próximos</button>
    </div>
    <span className={styles.somenteLeitor} role="status">{aviso}</span>
  </div>;
}

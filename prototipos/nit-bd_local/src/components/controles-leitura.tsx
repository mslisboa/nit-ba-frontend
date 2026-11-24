"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./controles-leitura.module.css";

const chave = "jd-local:preferencias-de-leitura";
const padrao = { tamanho: 100, contraste: false, espaco: false, movimento: false, lembrar: true };
const opcoes = [
  ["contraste", "Reforçar contraste"],
  ["espaco", "Aumentar o espaçamento do texto"],
  ["movimento", "Reduzir movimentos"],
  ["lembrar", "Lembrar preferências neste navegador"],
] as const;

export function Acessibilidade() {
  const [preferencias, setPreferencias] = useState(padrao);
  const [aberto, setAberto] = useState(false);
  const painel = useRef<HTMLDialogElement>(null);
  const botao = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const quadro = requestAnimationFrame(() => {
      try {
        const salvas = JSON.parse(localStorage.getItem(chave) ?? "null");
        if (!salvas) return;
        setPreferencias({
          tamanho: [100, 125, 150, 175, 200].includes(salvas.tamanho) ? salvas.tamanho : 100,
          contraste: salvas.contraste === true,
          espaco: salvas.espaco === true,
          movimento: salvas.movimento === true,
          lembrar: salvas.lembrar !== false,
        });
      } catch {
        // As opções continuam disponíveis quando o armazenamento local falha.
      }
    });
    return () => cancelAnimationFrame(quadro);
  }, []);

  useEffect(() => {
    const raiz = document.documentElement;
    raiz.style.setProperty("--jd-escala-leitura", String(preferencias.tamanho / 100));
    raiz.toggleAttribute("data-jd-contraste", preferencias.contraste);
    raiz.toggleAttribute("data-jd-espaco", preferencias.espaco);
    raiz.toggleAttribute("data-jd-movimento-reduzido", preferencias.movimento);
  }, [preferencias]);

  function atualizar(alteracoes: Partial<typeof padrao>) {
    const novas = { ...preferencias, ...alteracoes };
    setPreferencias(novas);
    try {
      if (novas.lembrar) localStorage.setItem(chave, JSON.stringify(novas));
      else localStorage.removeItem(chave);
    } catch {
      // A preferência vale para a sessão mesmo sem armazenamento.
    }
  }

  return <>
    <button ref={botao} className={styles.acessibilidade} type="button" aria-label="Acessibilidade" title="Acessibilidade"
      aria-haspopup="dialog" aria-expanded={aberto} aria-controls="preferencias-leitura"
      onClick={() => { painel.current?.showModal(); setAberto(true); }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="4.5" r="1.5" />
        <path d="m4 8 8 2 8-2m-8 2v5m0 0-4 6m4-6 4 6" />
      </svg>
      <span>Acessibilidade</span>
    </button>
    <dialog ref={painel} className={styles.painel} id="preferencias-leitura" aria-labelledby="titulo-preferencias"
      onClose={() => { setAberto(false); botao.current?.focus(); }}>
      <div className={styles.cabecalho}>
        <h2 id="titulo-preferencias">Acessibilidade</h2>
        <button type="button" aria-label="Fechar painel de acessibilidade" onClick={() => painel.current?.close()}>×</button>
      </div>
      <fieldset>
        <legend>Tamanho do conteúdo</legend>
        <div className={styles.tamanho}>
          <button type="button" aria-label="Diminuir tamanho" disabled={preferencias.tamanho === 100}
            onClick={() => atualizar({ tamanho: preferencias.tamanho - 25 })}>A−</button>
          <output aria-live="polite">{preferencias.tamanho}%</output>
          <button type="button" aria-label="Aumentar tamanho" disabled={preferencias.tamanho === 200}
            onClick={() => atualizar({ tamanho: preferencias.tamanho + 25 })}>A+</button>
        </div>
      </fieldset>
      <div className={styles.opcoes}>
        {opcoes.map(([nome, rotulo]) => <label key={nome}>
          <input type="checkbox" checked={preferencias[nome]} onChange={evento => atualizar({ [nome]: evento.target.checked })} />
          {rotulo}
        </label>)}
      </div>
      <button type="button" onClick={() => atualizar({ ...padrao, lembrar: preferencias.lembrar })}>Restaurar padrões</button>
    </dialog>
  </>;
}

export function VoltarAoTopo() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const conferirRolagem = () => setVisivel(window.scrollY > 300);
    conferirRolagem();
    window.addEventListener("scroll", conferirRolagem, { passive: true });
    return () => window.removeEventListener("scroll", conferirRolagem);
  }, []);

  return visivel && <button className={styles.voltar} type="button" aria-label="Voltar ao topo" title="Voltar ao topo"
    onClick={() => {
      document.getElementById("inicio-jd")?.focus({ preventScroll: true });
      window.scrollTo({ top: 0 });
    }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 11 6-6 6 6m-6-6v14" />
    </svg>
  </button>;
}

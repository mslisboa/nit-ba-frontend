"use client";
import { useEffect, useState } from "react";
import { consultar } from "@/services/api/client";

export function useConsulta<T>(url: string | null) {
  const [state, setState] = useState<{ url: string; data?: T; erro?: string }>({ url: "" });
  const [tentativa, setTentativa] = useState(0);
  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    consultar<T>(url, controller.signal).then(data => {
      if (!controller.signal.aborted) setState({ url, data });
    }).catch(error => {
      if (!controller.signal.aborted) setState({ url, erro: error instanceof Error ? error.message : "Consulta indisponível." });
    });
    return () => controller.abort();
  }, [url, tentativa]);
  const repetir = () => { setState({ url: "" }); setTentativa(n => n + 1); };
  return { data: state.url === url ? state.data : undefined, erro: state.url === url ? state.erro : undefined, repetir, retry: repetir };
}

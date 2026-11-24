import type { Metadata } from "next";
import { IndicadoresJD } from "@/components/indicadores-jd";
import { FaixaGeral } from "@/components/visao-geral";

export const metadata: Metadata = { title: "Indicadores · JD Local" };

export default function Page() {
  return <>
    <FaixaGeral titulo="Indicadores"
      descricao="Compare os pedidos de propriedade intelectual, os atos publicados e a presença institucional no recorte baiano." />
    <IndicadoresJD />
  </>;
}

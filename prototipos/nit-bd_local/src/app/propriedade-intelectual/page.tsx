import { ConsultaPI } from "@/components/perfil-pi";
import { FaixaGeral } from "@/components/visao-geral";
import type { ModalidadeCatalogo } from "@/components/patentes";

const modalidades = new Set<string>(["PTN", "PRG", "MRC", "DI", "IG", "TCI"]);
const anoValido = (ano: string | string[] | undefined) =>
  typeof ano === "string" && /^[1-9]\d{3}$/.test(ano) ? ano : undefined;

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const consulta = await searchParams;
  const modalidade = typeof consulta.modalidade === "string" && modalidades.has(consulta.modalidade)
    ? consulta.modalidade as ModalidadeCatalogo : undefined;
  const instituicao = typeof consulta.instituicao === "string" && /^[a-f0-9]{64}$/.test(consulta.instituicao)
    ? consulta.instituicao : undefined;
  const territorio = typeof consulta.territorio === "string" && consulta.territorio.length <= 100 ? consulta.territorio : undefined;
  const anoEvento = anoValido(consulta.ano_evento);
  const ano = anoEvento ? undefined : consulta.ano === "SEM_ANO" ? consulta.ano : anoValido(consulta.ano);

  return <>
    <FaixaGeral titulo="Propriedade intelectual" />
    <ConsultaPI key={JSON.stringify([modalidade, instituicao, territorio, anoEvento, ano])}
      painelId="consulta-pi" modalidadeInicial={modalidade} anoInicial={ano}
      filtrosIniciais={{ instituicao, territorio, anoEvento }}
      aviso={<aside className="jd-notice">
      <p>Pedidos e atos publicados têm contagens distintas. O acompanhamento de um processo pelo NIT e a situação jurídica exigem evidências próprias.</p>
    </aside>} />
  </>;
}

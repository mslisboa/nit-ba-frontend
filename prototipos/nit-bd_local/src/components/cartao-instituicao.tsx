import Image from "next/image";
import Link from "next/link";
import type { CampusEncontrado, Instituicao } from "@/lib/types";
import { estadoMedida, legendaMedida, modalidades, nomeEstrutura, numero, papelLocalizacao } from "@/lib/apresentacao";
import styles from "./cartao-instituicao.module.css";

const logos: Record<string, string> = {
  IFBA: "ifba.png",
  "IFBA-SAJ": "ifba.png",
  "IF BAIANO": "if-baiano.png",
  "IFBAIANO-LAPA": "if-baiano-lapa.png",
  UEFS: "uefs.png",
  UESB: "uesb.png",
  UESC: "uesc.png",
  UFBA: "ufba.png",
  UFOB: "ufob.png",
  UFRB: "ufrb.png",
  UFSB: "ufsb.png",
  UNEB: "uneb.png",
  UNIVASF: "univasf.png",
};

export function LogoInstitucional({ sigla }: { sigla: string }) {
  const logo = logos[sigla];
  return <div className={styles.logo}>
    {logo ? <Image src={`/logos/instituicoes/${logo}`} alt="" width={156} height={70} unoptimized /> : <strong>{sigla}</strong>}
  </div>;
}

export function MedidasInstitucionais({ totais }: { totais: Instituicao["totais"] }) {
  return <dl className={styles.medidas} aria-label="Processos de propriedade intelectual no recorte baiano">
    {modalidades.map(([modalidade, rotulo]) => {
      const total = totais.find(t => t.modalidade === modalidade && t.escopo === "RECORTE_BA");
      return <div key={modalidade}>
        <dt>{rotulo}</dt>
        <dd>
          {total?.processos != null ? numero(total.processos) : "—"}
          <small title={estadoMedida(total)}>{legendaMedida(total)}</small>
        </dd>
      </div>;
    })}
  </dl>;
}

export function CartaoInstituicao({ item, territorio, campi, compacto }: { item: Instituicao; territorio?: string; campi?: CampusEncontrado[]; compacto?: boolean }) {
  const medidasPI = modalidades.map(([modalidade]) =>
    item.totais.find(t => t.modalidade === modalidade && t.escopo === "RECORTE_BA")
  );
  const temContagem = medidasPI.some(medida => medida?.processos != null);
  const pedidos = medidasPI.reduce((total, medida) => total + (medida?.processos ?? 0), 0);

  return <Link className={compacto ? `${styles.cartao} ${styles.compacto}` : styles.cartao} href={`/instituicoes/${item.id}`} aria-label={`Ver perfil de ${item.nome}`}>
    <div className={styles.topo}>
      <LogoInstitucional sigla={item.sigla} />
      {item.tipo === "UNIDADE" && <span className={styles.tipo}>Campus / unidade</span>}
    </div>
    <div className={styles.corpo}>
      <span className={styles.sigla}>{item.tipo === "UNIDADE" ? "Campus" : "Instituição"} · {item.sigla}</span>
      <h3>{item.nome}</h3>
      <div className={styles.estrutura}>
        <span>NIT ou estrutura de inovação</span>
        <strong>{nomeEstrutura(item)}</strong>
      </div>
      <div className={styles.localizacao}>
        <span>{item.municipio} · {item.uf}</span>
        <span>{papelLocalizacao(item.papel_localizacao)}</span>
        {territorio && <span>{territorio}</span>}
      </div>
      {campi?.length ? <ul className={styles.campiEncontrados} aria-label="Campi encontrados na busca">
        {campi.map(campus => <li key={campus.sigla}><strong>Campus encontrado</strong> · {campus.nome} ({campus.municipio})</li>)}
      </ul> : null}
      <dl className={`${styles.medidas} ${styles.resumo}`} aria-label="Indicadores da referência">
        <div><dt>Pesquisadores</dt><dd className={styles.pendente}>A integrar</dd></div>
        <div><dt>Tecnologias</dt><dd className={styles.pendente}>A integrar</dd></div>
        <div>
          <dt>Ativos de PI</dt>
          <dd>{temContagem ? numero(pedidos) : "—"}<small>{temContagem ? "Pedidos no recorte baiano" : "Sem contagem disponível"}</small></dd>
        </div>
      </dl>
    </div>
  </Link>;
}

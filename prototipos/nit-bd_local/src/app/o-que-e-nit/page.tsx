import Link from "next/link";
import { atividades, exemplos, referencias } from "./conteudo";
import { ExemplosNit } from "./exemplos";
import styles from "./guia.module.css";

const assuntos = [
  ["conceito", "O conceito"],
  ["atuacao", "Na prática"],
  ["exemplo", "Um exemplo"],
  ["bahia", "Na Bahia"],
  ["siglas", "NIT, ICT e FormICT"],
  ["referencias", "Referências"],
];

function Fonte({ fonte, children }: { fonte: keyof typeof referencias; children?: string }) {
  return <a className={styles.fonte} href={referencias[fonte].url} target="_blank" rel="noopener noreferrer">
    {children ?? referencias[fonte].titulo}
  </a>;
}

export default function Page() {
  return <div className={styles.guia}>
    <div className={styles.hero}>
      <h1>O que é um NIT?</h1>
      <p>Entenda o papel dos Núcleos de Inovação Tecnológica e sua relação com a pesquisa, as instituições e a sociedade.</p>
    </div>
    <nav className={styles.indice} aria-label="Assuntos desta página">
      {assuntos.map(([id, rotulo]) => <a key={id} href={`#nit-guide-${id}`}>{rotulo}</a>)}
    </nav>

    <section className={`${styles.secao} ${styles.intro}`} id="nit-guide-conceito">
      <div>
        <h2>Uma ponte entre pesquisa e inovação</h2>
        <p>O <strong>Núcleo de Inovação Tecnológica (NIT)</strong> é a estrutura que cuida da política de inovação de uma ou mais Instituições Científicas, Tecnológicas e de Inovação (ICTs). Apoia a proteção das criações e a transferência de conhecimento para aplicações na sociedade e no setor produtivo.</p>
        <p>Um NIT pode ser próprio ou compartilhado, com ou sem personalidade jurídica. Cada instituição pode organizar sua estrutura de inovação conforme a política e as atribuições que lhe cabem.</p>
        <p className={styles.nota}>Base legal. <Fonte fonte="federal">Lei de Inovação, art. 2º, VI, e art. 16</Fonte>.</p>
      </div>
      <aside className={styles.resumo}>
        <span aria-hidden="true">NIT</span>
        <p><strong>Conhecimento que encontra caminhos.</strong> Proteger, conectar e transferir são partes desse trabalho.</p>
        <Link className="jd-button" href="/instituicoes">Consultar instituições e NITs</Link>
      </aside>
    </section>

    <section className={styles.secao} id="nit-guide-atuacao">
      <h2>O que um NIT faz na prática?</h2>
      <p>Estas são algumas frentes de atuação previstas na Lei de Inovação. Os serviços oferecidos e a organização variam conforme a instituição.</p>
      <div className={styles.atividades}>{atividades.map(item => <article key={item.titulo}>
        <h3>{item.titulo}</h3><p>{item.descricao}</p>
      </article>)}</div>
      <p className={styles.nota}>A política institucional pode incluir ações de empreendedorismo e articulação com incubadoras. <Fonte fonte="federal">Lei nº 10.973/2004, art. 16, § 1º</Fonte>.</p>
    </section>

    <section className={`${styles.secao} ${styles.exemplo}`} id="nit-guide-exemplo">
      <h2>Da descoberta à aplicação</h2>
      <p><strong>Exemplo hipotético.</strong> Uma equipe de universidade desenvolve um software para melhorar o uso de água na agricultura.</p>
      <ol className={styles.etapas}>
        <li><b>A equipe cria</b><span>Desenvolve e testa a solução.</span></li>
        <li><b>O NIT orienta</b><span>Avalia a proteção e os caminhos de transferência.</span></li>
        <li><b>A instituição e parceiros negociam</b><span>Definem condições para licenciamento ou cooperação.</span></li>
        <li><b>A solução pode chegar ao uso</b><span>Sua adoção depende de validação e das condições acordadas.</span></li>
      </ol>
      <p className={styles.nota}>Os papéis de proteção e negociação se baseiam no <Fonte fonte="federal">art. 16 da Lei de Inovação</Fonte>.</p>
    </section>

    <section className={styles.secao} id="nit-guide-bahia">
      <h2>Como isso aparece na Bahia?</h2>
      <p>As instituições podem adotar nomes diferentes para suas estruturas de inovação. Os {exemplos.length} exemplos institucionais do guia são acompanhados por referências oficiais e têm finalidade educativa.</p>
      <ExemplosNit />
      <div className={styles.rede}>
        <h3>A Rede-NIT no ecossistema estadual</h3>
        <p>A Resolução SECTI nº 002/2025, publicada em 19 de junho de 2025, instituiu o SEAPI e incluiu a Rede de Núcleos de Inovação Tecnológica em sua composição. Entre os objetivos da Rede-NIT estão a articulação entre os núcleos e a conexão com outros atores da inovação.</p>
        <p className={styles.nota}><Fonte fonte="rede">Resolução SECTI nº 002/2025, arts. 1º e 17</Fonte>.</p>
      </div>
      <details className={styles.legislacao}>
        <summary>Quais são as principais referências legais?</summary>
        <ul>
          <li><b>Lei Federal nº 10.973/2004.</b> Define ICT e NIT e estabelece competências dos núcleos. <Fonte fonte="federal">Consultar texto atualizado</Fonte>.</li>
          <li><b>Lei Estadual nº 14.315/2021.</b> Marco legal de CT&I da Bahia. <Fonte fonte="bahia">Consultar a página oficial da SECTI</Fonte>.</li>
          <li><b>Decreto Estadual nº 22.327/2023.</b> Regulamenta a lei estadual de 2021. <Fonte fonte="decreto">Consultar publicação no Diário Oficial</Fonte>.</li>
          <li><b>Resolução SECTI nº 002/2025.</b> Institui o SEAPI e contempla a Rede-NIT. <Fonte fonte="rede">Consultar resolução</Fonte>.</li>
        </ul>
      </details>
    </section>

    <section className={styles.secao} id="nit-guide-siglas">
      <h2>Qual é a diferença entre NIT, ICT e FormICT?</h2>
      <div className={styles.siglas}>
        <article><h3>ICT</h3><p><b>A instituição.</b> Organização que inclui pesquisa ou desenvolvimento de novos produtos, serviços ou processos em sua missão. Pode ser pública ou uma entidade privada sem fins lucrativos que atenda à definição legal.</p><Fonte fonte="federal">Lei de Inovação, art. 2º, V</Fonte></article>
        <article><h3>NIT</h3><p><b>A estrutura de gestão da inovação.</b> Atua na política de inovação de uma ou mais ICTs.</p><Fonte fonte="federal">Lei de Inovação, art. 2º, VI</Fonte></article>
        <article><h3>FormICT</h3><p><b>O instrumento de coleta de informações.</b> Reúne dados institucionais sobre política de inovação, propriedade intelectual e contratos de tecnologia.</p><Fonte fonte="formict">INT/MCTI · apresentação do FormICT</Fonte></article>
      </div>
      <p className={styles.nota}>Na leitura dos indicadores do JD, considere a fonte, o período e a unidade de contagem. O vínculo de um processo com a atuação de um NIT exige evidência própria.</p>
    </section>

    <section className={styles.secao} id="nit-guide-referencias">
      <h2>Referências para continuar a leitura</h2>
      <p>Fontes oficiais e institucionais reunidas pelo guia do protótipo em <time dateTime="2026-11-21">21 de novembro de 2026</time>.</p>
      <ul className={styles.referencias}>
        {(Object.keys(referencias) as (keyof typeof referencias)[]).map(fonte => <li key={fonte}><Fonte fonte={fonte} /></li>)}
      </ul>
    </section>
  </div>;
}

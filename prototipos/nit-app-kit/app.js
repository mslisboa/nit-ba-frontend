const app = document.querySelector('#app');
const navLinks = [...document.querySelectorAll('[data-route-link]')];
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
const siteVersion = new URLSearchParams(location.search).get('versao') === 'geral' ? 'geral' : 'v1';
document.body.dataset.version = siteVersion;
document.querySelectorAll('[data-version-link]').forEach(link => {
  const active = link.dataset.versionLink === siteVersion;
  link.classList.toggle('active', active);
  if (active) link.setAttribute('aria-current', 'page');
});
document.querySelectorAll('[data-general-only]').forEach(item => { item.hidden = siteVersion === 'v1'; });
document.querySelectorAll('[data-v1-only]').forEach(item => { item.hidden = siteVersion !== 'v1'; });
const nitsNavLabel = document.querySelector('[data-nits-nav-label]');
if (nitsNavLabel && siteVersion === 'v1') nitsNavLabel.textContent = 'NITs';

const territoryNames = [
  'Irecê', 'Velho Chico', 'Chapada Diamantina', 'Sisal', 'Litoral Sul', 'Baixo Sul',
  'Extremo Sul', 'Médio Sudoeste da Bahia', 'Vale do Jiquiriçá', 'Sertão do São Francisco',
  'Bacia do Rio Grande', 'Bacia do Paramirim', 'Sertão Produtivo', 'Piemonte do Paraguaçu',
  'Bacia do Jacuípe', 'Piemonte da Diamantina', 'Semiárido Nordeste II',
  'Litoral Norte e Agreste Baiano', 'Portal do Sertão', 'Sudoeste Baiano', 'Recôncavo',
  'Médio Rio de Contas', 'Bacia do Rio Corrente', 'Itaparica', 'Piemonte Norte do Itapicuru',
  'Metropolitano de Salvador', 'Costa do Descobrimento'
];

const unebTerritories = [
  'Bacia do Rio Grande', 'Baixo Sul', 'Chapada Diamantina', 'Costa do Descobrimento', 'Extremo Sul',
  'Irecê', 'Itaparica', 'Litoral Norte e Agreste Baiano', 'Médio Rio de Contas',
  'Metropolitano de Salvador', 'Piemonte da Diamantina', 'Piemonte do Paraguaçu',
  'Piemonte Norte do Itapicuru', 'Recôncavo', 'Semiárido Nordeste II', 'Sertão do São Francisco',
  'Sertão Produtivo', 'Sisal', 'Velho Chico'
];

const ifbaTerritories = territoryNames.filter(name => name !== 'Bacia do Paramirim');

const demoNits = [
  { id: 'ufba', name: 'Coordenação de Inovação — NIT UFBA', acronym: 'UFBA', institution: 'Universidade Federal da Bahia', municipality: 'Salvador', territory: 'Metropolitano de Salvador', territories: ['Metropolitano de Salvador', 'Sudoeste Baiano'], nature: 'Federal', model: 'Próprio', status: 'Ativo', site: 'https://nit.ufba.br/', researchers: 184, technologies: 37, pi: 62 },
  { id: 'uefs', name: 'InovaUEFS', acronym: 'UEFS', institution: 'Universidade Estadual de Feira de Santana', municipality: 'Feira de Santana', territory: 'Portal do Sertão', territories: ['Portal do Sertão'], nature: 'Estadual', model: 'Próprio', status: 'Ativo', site: 'https://inova.uefs.br/', researchers: 146, technologies: 24, pi: 41 },
  { id: 'uesc', name: 'Núcleo de Inovação Tecnológica da UESC', acronym: 'UESC', institution: 'Universidade Estadual de Santa Cruz', municipality: 'Ilhéus', territory: 'Litoral Sul', territories: ['Litoral Sul'], nature: 'Estadual', model: 'Próprio', status: 'Ativo', site: 'https://www.uesc.br/nucleos/nit/', researchers: 132, technologies: 31, pi: 53 },
  { id: 'uesb', name: 'Núcleo de Inovação Tecnológica da UESB', acronym: 'UESB', institution: 'Universidade Estadual do Sudoeste da Bahia', municipality: 'Vitória da Conquista', territory: 'Sudoeste Baiano', territories: ['Sudoeste Baiano', 'Médio Rio de Contas', 'Médio Sudoeste da Bahia'], nature: 'Estadual', model: 'Próprio', status: 'Ativo', site: 'http://www2.uesb.br/nit/', researchers: 121, technologies: 19, pi: 36 },
  { id: 'ufrb', name: 'Coordenação de Criação e Inovação — CINOVA', acronym: 'UFRB', institution: 'Universidade Federal do Recôncavo da Bahia', municipality: 'Cruz das Almas', territory: 'Recôncavo', territories: ['Recôncavo', 'Vale do Jiquiriçá', 'Portal do Sertão'], nature: 'Federal', model: 'Próprio', status: 'Ativo', site: 'https://ufrb.edu.br/ppgci/coordenacao-de-criacao-e-inovacao-cinova', researchers: 118, technologies: 16, pi: 29 },
  { id: 'uneb', name: 'Agência UNEB de Inovação', acronym: 'UNEB', institution: 'Universidade do Estado da Bahia', municipality: 'Salvador', territory: 'Metropolitano de Salvador', territories: unebTerritories, nature: 'Estadual', model: 'Próprio', status: 'Ativo', site: 'https://inovacao.uneb.br/', researchers: 210, technologies: 22, pi: 48 },
  { id: 'ufob', name: 'Propriedade Intelectual e Transferência de Tecnologia — PITT', acronym: 'UFOB', institution: 'Universidade Federal do Oeste da Bahia', municipality: 'Barreiras', territory: 'Bacia do Rio Grande', territories: ['Bacia do Rio Grande', 'Velho Chico', 'Bacia do Rio Corrente'], nature: 'Federal', model: 'Próprio', status: 'Em consolidação', site: 'https://ufob.edu.br/a-ufob/inovacao/propriedade-intelectual-e-transferencia-de-tecnologia', researchers: 74, technologies: 9, pi: 17 },
  { id: 'ufsb', name: 'Núcleo de Inovação Tecnológica da UFSB', acronym: 'UFSB', institution: 'Universidade Federal do Sul da Bahia', municipality: 'Itabuna', territory: 'Litoral Sul', territories: ['Litoral Sul', 'Costa do Descobrimento', 'Extremo Sul'], nature: 'Federal', model: 'Próprio', status: 'Em consolidação', site: 'https://ufsb.edu.br/', researchers: 69, technologies: 8, pi: 13 },
  { id: 'cimatec', name: 'Ecossistema de Pesquisa e Inovação SENAI CIMATEC', acronym: 'CIMATEC', institution: 'Centro Universitário SENAI CIMATEC', municipality: 'Salvador', territory: 'Metropolitano de Salvador', territories: ['Metropolitano de Salvador'], nature: 'Sistema S', model: 'Integrado', status: 'Ativo', site: 'https://www.senaicimatec.com.br/pesquisa-e-inovacao/', researchers: 156, technologies: 46, pi: 70 },
  { id: 'bahiana', name: 'Núcleo de Inovação da Bahiana', acronym: 'BAHIANA', institution: 'Escola Bahiana de Medicina e Saúde Pública', municipality: 'Salvador', territory: 'Metropolitano de Salvador', territories: ['Metropolitano de Salvador'], nature: 'Privada sem fins lucrativos', model: 'Próprio', status: 'Ativo', site: 'https://www.bahiana.edu.br/inovacao-parcerias/', researchers: 74, technologies: 12, pi: 18 },
  { id: 'ifba', name: 'Núcleo de Inovação Tecnológica do IFBA', acronym: 'IFBA', institution: 'Instituto Federal de Educação, Ciência e Tecnologia da Bahia', municipality: 'Salvador', territory: 'Metropolitano de Salvador', territories: ifbaTerritories, nature: 'Federal', model: 'Próprio', status: 'Ativo', site: '', researchers: 96, technologies: 14, pi: 20 },
  { id: 'fiocruz', name: 'Gestão de inovação e transferência de tecnologia', acronym: 'FIOCRUZ', institution: 'Instituto Gonçalo Moniz — Fiocruz Bahia', municipality: 'Salvador', territory: 'Metropolitano de Salvador', territories: ['Metropolitano de Salvador'], nature: 'Federal', model: 'Integrado', status: 'Ativo', site: '', researchers: 88, technologies: 18, pi: 27 }
];

const institutionLocations = {
  ufba: ['Salvador', 'Camaçari', 'Vitória da Conquista'],
  uefs: ['Feira de Santana'],
  uesc: ['Ilhéus'],
  uesb: ['Vitória da Conquista', 'Jequié', 'Itapetinga'],
  ufrb: ['Cruz das Almas', 'Amargosa', 'Cachoeira/São Félix', 'Feira de Santana', 'Santo Amaro', 'Santo Antônio de Jesus'],
  uneb: ['Salvador', 'Alagoinhas', 'Juazeiro', 'Jacobina', 'Santo Antônio de Jesus', 'Caetité', 'Senhor do Bonfim', 'Paulo Afonso', 'Barreiras', 'Teixeira de Freitas', 'Serrinha', 'Guanambi', 'Itaberaba', 'Conceição do Coité', 'Valença', 'Camaçari', 'Eunápolis', 'Irecê', 'Bom Jesus da Lapa', 'Ipiaú', 'Brumado', 'Euclides da Cunha', 'Seabra', 'Xique-Xique', 'Lauro de Freitas', 'Jeremoabo', 'Canudos'],
  ufob: ['Barreiras', 'Barra', 'Bom Jesus da Lapa', 'Luís Eduardo Magalhães', 'Santa Maria da Vitória'],
  ufsb: ['Itabuna', 'Porto Seguro', 'Teixeira de Freitas'],
  cimatec: ['Salvador'],
  bahiana: ['Salvador'],
  ifba: ['Barreiras', 'Brumado', 'Camaçari', 'Campo Formoso', 'Euclides da Cunha', 'Eunápolis', 'Feira de Santana', 'Ilhéus', 'Irecê', 'Jacobina', 'Jaguaquara', 'Jequié', 'Juazeiro', 'Lauro de Freitas', 'Paulo Afonso', 'Porto Seguro', 'Salvador', 'Santo Amaro', 'Santo Antônio de Jesus', 'Seabra', 'Simões Filho', 'Valença', 'Vitória da Conquista'],
  fiocruz: ['Salvador']
};

const institutionHeadquarters = {
  ufba: 'Palácio da Reitoria — Rua Augusto Viana, s/n, Canela, Salvador – BA, CEP 40110-909',
  uefs: 'Avenida Transnordestina, s/n, Novo Horizonte, Feira de Santana – BA, CEP 44036-900',
  uesc: 'Campus Soane Nazaré de Andrade — Rodovia Jorge Amado, km 16, Salobrinho, Ilhéus – BA, CEP 45662-900',
  uesb: 'Campus de Vitória da Conquista — Estrada do Bem Querer, km 4, Bairro Universitário, Vitória da Conquista – BA, CEP 45031-900',
  ufrb: 'Rua Rui Barbosa, 710, Centro, Cruz das Almas – BA, CEP 44380-000',
  uneb: 'Rua Silveira Martins, 2555, Cabula, Salvador – BA, CEP 41150-000',
  ufob: 'Rua Professor José Seabra de Lemos, 316, Recanto dos Pássaros, Barreiras – BA, CEP 47808-021',
  ufsb: 'Praça José Bastos, s/n, Centro, Itabuna – BA, CEP 45600-923',
  cimatec: 'Avenida Orlando Gomes, 1845, Piatã, Salvador – BA, CEP 41650-010',
  bahiana: 'Campus Brotas — Avenida Dom João VI, 275, Brotas, Salvador – BA, CEP 40290-000',
  ifba: 'Reitoria — Avenida Araújo Pinho, 39, Canela, Salvador – BA, CEP 40110-150',
  fiocruz: 'Rua Waldemar Falcão, 121, Candeal, Salvador – BA, CEP 40296-710'
};

demoNits.forEach(item => {
  item.locations = institutionLocations[item.id] || [item.municipality];
  item.headquartersAddress = institutionHeadquarters[item.id] || `${item.municipality} – BA`;
  item.nitCoverageStatus = 'Cobertura de atendimento em validação';
});

const territorialPresenceTotal = demoNits.reduce((total, item) => total + item.territories.length, 0);

const institutionLogos = {
  UFBA: 'ufba.png', BAHIANA: 'bahiana.png', UESB: 'uesb.png', UFOB: 'ufob.png',
  UFSB: 'ufsb.png', UEFS: 'uefs.png', UESC: 'uesc.png', UFRB: 'ufrb.png',
  UNEB: 'uneb.png', IFBA: 'ifba.png', FIOCRUZ: 'fiocruz-bahia.png', CIMATEC: 'senai-cimatec.png'
};

const institutionLogo = (acronym, variant = 'card') => {
  const file = institutionLogos[acronym];
  if (!file) return `<span class="entity-logo">${acronym}</span>`;
  return `<span class="institution-logo institution-logo-${variant}"><img src="assets/logos/instituicoes/${file}" alt="Logomarca ${acronym}"></span>`;
};

const territorySummary = item => item.territories.length === 1
  ? item.territories[0]
  : `${item.territories.length} territórios`;

const territoryChips = item => `<div class="territory-chip-list">${item.territories.map(name => `<a href="#nits/territorio/${encodeURIComponent(name)}">${name}</a>`).join('')}</div>`;
const locationChips = item => `<div class="territory-chip-list location-chip-list">${item.locations.map(name => `<span>${name}</span>`).join('')}</div>`;

const unitPresenceTable = item => `<div class="unit-presence-block"><div class="panel-head"><div><h3>Unidades e presença territorial</h3><p>A sede possui endereço confirmado; as demais localidades serão georreferenciadas na consolidação da base.</p></div></div><div class="compact-table unit-table"><div class="table-row table-head"><span>Unidade</span><span>Município</span><span>Território</span><span>Coordenadas</span></div>${item.locations.map((location,index)=>`<div class="table-row"><span><b>${index === 0 ? 'Sede administrativa' : `Unidade ${String(index + 1).padStart(2,'0')}`}</b>${index === 0 ? `<small>${item.headquartersAddress}</small>` : ''}</span><span>${location}</span><span>${index === 0 ? item.territory : 'A confirmar por unidade'}</span><span>${index === 0 ? 'Geocodificação pendente' : '—'}</span></div>`).join('')}</div></div>`;

const institutions = demoNits.map((nit, index) => ({
  id: nit.id, initials: nit.acronym, name: nit.institution, nature: nit.nature,
  municipality: nit.municipality, territory: nit.territory, territories: nit.territories, nit: nit.name,
  units: nit.locations.length, researchers: nit.researchers, technologies: nit.technologies, pi: nit.pi
}));

const territoryColors = ['#2453e6','#a34da6','#078174','#d88416','#d82f4d','#356b9c','#5b46b8','#52657a'];
const territories = territoryNames.map((name, index) => {
  const related = demoNits.filter(item => item.territories.includes(name));
  return {
    name,
    municipalities: `${related.length} instituiç${related.length === 1 ? 'ão' : 'ões'} com presença registrada`,
    nits: related.length,
    icts: related.length,
    researchers: Math.round(related.reduce((total, item) => total + item.researchers / item.territories.length, 0)),
    color: territoryColors[index % territoryColors.length]
  };
}).sort((a, b) => b.nits - a.nits || a.name.localeCompare(b.name, 'pt-BR'));

const researchers = [
  { name: 'Pesquisadora demonstrativa 01', area: 'Biotecnologia e saúde', institution: 'UESC', nits: ['NIT UESC', 'InovaUEFS'], projects: 3, productions: 12 },
  { name: 'Pesquisador demonstrativo 02', area: 'Energia e sustentabilidade', institution: 'UFBA', nits: ['NIT UFBA'], projects: 5, productions: 18 },
  { name: 'Pesquisadora demonstrativa 03', area: 'Ciência de dados', institution: 'UNEB', nits: ['Agência UNEB', 'CINOVA/UFRB'], projects: 2, productions: 9 },
  { name: 'Pesquisador demonstrativo 04', area: 'Engenharia de materiais', institution: 'SENAI CIMATEC', nits: ['CIMATEC', 'NIT UFBA'], projects: 4, productions: 15 },
  { name: 'Pesquisadora demonstrativa 05', area: 'Tecnologias educacionais', institution: 'UEFS', nits: ['InovaUEFS'], projects: 3, productions: 11 },
  { name: 'Pesquisador demonstrativo 06', area: 'Agroindústria e bioeconomia', institution: 'UFRB', nits: ['CINOVA/UFRB', 'NIT UESC'], projects: 4, productions: 14 }
];

const technologies = [
  { title: 'Biossensor portátil para análise rápida', area: 'Saúde', category: 'Patente', stage: 'TRL 5', institution: 'UESC', nit: 'NIT UESC', status: 'Em validação' },
  { title: 'Plataforma de gestão de ativos de PI', area: 'Tecnologia da informação', category: 'Software', stage: 'TRL 7', institution: 'UFBA', nit: 'NIT UFBA', status: 'Disponível para parceria' },
  { title: 'Bioinsumo para agricultura sustentável', area: 'Agrárias', category: 'Patente', stage: 'TRL 4', institution: 'UFRB', nit: 'CINOVA/UFRB', status: 'Em desenvolvimento' },
  { title: 'Sistema inteligente de eficiência energética', area: 'Energia', category: 'Software', stage: 'TRL 6', institution: 'SENAI CIMATEC', nit: 'CIMATEC', status: 'Prova de conceito' },
  { title: 'Material compósito de fonte renovável', area: 'Materiais', category: 'Patente', stage: 'TRL 5', institution: 'UESB', nit: 'NIT UESB', status: 'Em validação' },
  { title: 'Ambiente digital de aprendizagem inclusiva', area: 'Educação', category: 'Software', stage: 'TRL 8', institution: 'UNEB', nit: 'Agência UNEB', status: 'Em uso piloto' }
];

const intellectualProperty = [
  ['PI-BA-2026-001','Patente','Biossensor portátil','UESC','Em exame','2026'],
  ['PI-BA-2026-002','Software','Gestão de ativos de PI','UFBA','Registrado','2026'],
  ['PI-BA-2025-014','Patente','Bioinsumo agrícola','UFRB','Depositado','2025'],
  ['PI-BA-2025-021','Marca','Programa Conecta NIT','UNEB','Registrada','2025'],
  ['PI-BA-2025-028','Software','Eficiência energética','CIMATEC','Registrado','2025'],
  ['PI-BA-2024-033','Patente','Compósito renovável','UESB','Em exame','2024'],
  ['PI-BA-2024-041','Desenho industrial','Dispositivo assistivo','UEFS','Concedido','2024'],
  ['PI-BA-2024-052','Cultivar','Variedade demonstrativa','UFOB','Em avaliação','2024']
];

const pageNames = {
  inicio: 'Início', nits: 'Instituições e NITs', perfil: 'Perfil da instituição e do NIT', instituicoes: 'Instituições e NITs',
  territorios: 'Territórios', pesquisadores: 'Pesquisadores', tecnologias: 'Tecnologias',
  propriedade: 'Propriedade intelectual', indicadores: 'Indicadores', eventos: 'Eventos e formação',
  fontes: 'Fontes e metodologia', 'mapa-do-site': 'Mapa do site'
};
if (siteVersion === 'v1') {
  pageNames.nits = 'NITs';
  pageNames.instituicoes = 'Instituições';
  pageNames.perfil = 'Instituição e NIT relacionado';
}

function icon(label) { return `<span class="icon-disc" aria-hidden="true">${label}</span>`; }
function demoLabel(text = '') {
  if (!text || /demonstrativo|fictíci/i.test(text)) return '';
  return `<span class="demo-label">${text}</span>`;
}
function metricSource(label) {
  if (/NIT|Institui|Território/i.test(label)) return 'DataNIT e sites institucionais';
  if (/Pesquisador/i.test(label)) return 'ICTs e vínculos institucionais';
  if (/Tecnologia|PI|Patente|Software|Marca|ativo/i.test(label)) return 'Portfólios dos NITs';
  return 'Registros institucionais integrados';
}
function metric(value, label, detail, symbol) {
  return `<article class="metric-card">${icon(symbol)}<div><strong>${value}</strong><span>${label}</span><small>${detail}</small><footer class="metric-source">Amostra demonstrativa · sem validação oficial</footer></div></article>`;
}
function nitCard(item) {
  return `<a class="entity-card nit-card unified-entity-card" href="#perfil/${item.id}" aria-label="Abrir perfil de ${item.institution}"><div class="card-top logo-card-top">${institutionLogo(item.acronym, 'compact')}<span class="status-dot ${item.status === 'Ativo' ? 'ok' : 'warn'}">${item.status}</span></div><span class="entity-kicker">Instituição</span><h3>${item.institution}</h3><div class="linked-record"><span>NIT principal</span><b>${item.name}</b></div><div class="meta"><span class="tag">${item.nature}</span><span class="tag territory-count-tag">${territorySummary(item)}</span><span class="tag">${item.model}</span></div><dl class="mini-stats"><div><dt>Pesquisadores</dt><dd>${item.researchers}</dd></div><div><dt>Tecnologias</dt><dd>${item.technologies}</dd></div><div><dt>Ativos de PI</dt><dd>${item.pi}</dd></div></dl></a>`;
}

function institutionalHome() {
  const featured = demoNits.slice(0, 4);
  const featuredTerritories = territories.slice(0, 6);
  const featuredTerritoryPresence = featuredTerritories.reduce((total, territory) => total + territory.nits, 0);
  return `<div class="page overview-page">
    <section class="overview-head"><div class="wrap"><div class="title-row"><div><h1>Ecossistema de inovação da Bahia</h1><p class="lede">Uma leitura integrada dos NITs, instituições, territórios, pessoas, tecnologias e ativos de propriedade intelectual.</p></div><div class="update-card"><span>Última referência</span><strong>06 nov 2026</strong><small>Valores operacionais simulados</small></div></div></div></section>
    <section class="overview-body"><div class="wrap">
      <div class="metric-grid">${metric('12','NITs mapeados','12 perfis integrados','N')}${metric('12','Instituições vinculadas','ICTs públicas e privadas','I')}${metric('1.284','Pesquisadores','vínculos ativos demonstrativos','P')}${metric('167','Tecnologias','em diferentes estágios','TC')}${metric('328','Ativos de PI','patentes, software e marcas','PI')}${metric('26','Territórios com presença','dos 27 Territórios de Identidade','T')}</div>
      <div class="overview-grid">
        <section class="content-panel territory-overview"><div class="panel-head"><div><h2>Presenças de NITs por território</h2></div><a class="text-link" href="#territorios">Ver todos</a></div><div class="coverage-count-explainer"><span><b>${demoNits.length}</b>NITs únicos</span><span><b>${territorialPresenceTotal}</b>vínculos NIT–território</span><span><b>${featuredTerritoryPresence}</b>presenças nas 6 faixas abaixo</span></div><div class="territory-bars">${featuredTerritories.map(t => `<a href="#nits/territorio/${encodeURIComponent(t.name)}"><span><i style="background:${t.color}"></i>${t.name}</span><b>${t.nits}</b><em style="width:${Math.max(16,t.nits*22)}%;background:${t.color}"></em></a>`).join('')}</div><p class="panel-note"><b>Como ler:</b> cada barra conta quantos NITs possuem presença institucional naquele território. Um mesmo NIT multicampi aparece em mais de uma barra; por isso os valores territoriais não devem ser somados para obter o total de 12 NITs.</p></section>
        <aside class="content-panel quality-panel"><div class="panel-head"><div><h2>Completude</h2></div><strong class="quality-score">86%</strong></div><div class="quality-list"><div><span>Identificação institucional</span><b>100%</b></div><div><span>Endereço e território</span><b>92%</b></div><div><span>Contatos e canais</span><b>84%</b></div><div><span>Indicadores anuais</span><b>71%</b></div><div><span>Fonte e data de coleta</span><b>96%</b></div></div><a class="button secondary full" href="#fontes">Ver metodologia e fontes</a></aside>
      </div>
      <section class="section-block"><div class="panel-head"><div><h2>Da instituição aos resultados de inovação</h2></div><p>A instituição mantém seu NIT, que apoia pesquisadores e projetos na criação, proteção e transferência de tecnologias.</p></div><div class="relationship-flow plain-language"><a href="#nits"><b>Instituição</b><span>Universidade, instituto ou centro de pesquisa</span></a><i>mantém</i><a href="#nits"><b>NIT</b><span>Coordena inovação e propriedade intelectual</span></a><i>apoia</i><a href="#pesquisadores"><b>Pessoas e projetos</b><span>Pesquisa e colaboração entre instituições</span></a><i>desenvolvem</i><a href="#tecnologias"><b>Tecnologias</b><span>Soluções em diferentes estágios</span></a><i>podem gerar</i><a href="#propriedade"><b>Ativos de PI</b><span>Patentes, softwares, marcas e outros</span></a></div><p class="relationship-note">Um pesquisador pode colaborar com mais de uma instituição ou NIT. Essas ligações serão registradas nos vínculos e projetos.</p></section>
      <section class="section-block network-highlight-section"><div class="panel-head"><div><h2>Instituições e NITs em destaque</h2><p>Este recorte apresenta quatro perfis para consulta rápida. O catálogo completo reúne as 12 instituições, seus NITs, sedes, presença territorial e indicadores.</p></div><a class="text-link" href="#nits">Ver as 12 instituições</a></div><div class="network-highlight-grid">${featured.map(n => `<a class="network-highlight-card" href="#perfil/${n.id}"><header>${institutionLogo(n.acronym, 'compact')}<i class="status-dot ${n.status === 'Ativo' ? 'ok' : 'warn'}">${n.status}</i></header><span class="entity-kicker">${n.nature}</span><h3>${n.institution}</h3><p><b>NIT:</b> ${n.name}</p><dl><div><dt>Sede</dt><dd>${n.municipality}</dd></div><div><dt>Presença institucional</dt><dd>${territorySummary(n)}</dd></div><div><dt>Pesquisadores</dt><dd>${n.researchers}</dd></div></dl><span class="card-open-action">Abrir perfil</span></a>`).join('')}</div></section>
      <section class="section-block"><div class="panel-head"><div><h2>Explore a base por perspectiva</h2></div></div><div class="quick-grid"><a href="#nits">${icon('I')}<b>Instituições e NITs</b><span>Perfis, contatos, serviços e vínculos</span></a><a href="#territorios">${icon('T')}<b>Territórios</b><span>Cobertura regional e municípios</span></a><a href="#pesquisadores">${icon('P')}<b>Pesquisadores</b><span>Competências e participações</span></a><a href="#tecnologias">${icon('TC')}<b>Tecnologias</b><span>Portfólio e estágio de maturidade</span></a><a href="#propriedade">${icon('PI')}<b>Propriedade intelectual</b><span>Proteção, titularidade e situação</span></a><a href="#indicadores">${icon('↗')}<b>Indicadores</b><span>Séries e leituras integradas</span></a></div></section>
    </div></section>
  </div>`;
}

function homePage() {
  return institutionalHome();
}

function v1HomePage() {
  const active = demoNits.filter(item => item.status === 'Ativo').length;
  const metrics = [
    ['nits', demoNits.length, 'NITs na amostra', `${active} ativos · ${demoNits.length - active} em consolidação`, 'N'],
    ['instituicoes', institutions.length, 'Instituições', 'Sedes e presença territorial', 'I'],
    ['territorios', territoryNames.length, 'Territórios', 'Explore a distribuição na Bahia', 'T'],
    ['propriedade', intellectualProperty.length, 'Registros de PI', 'Registros detalhados disponíveis', 'PI']
  ];
  const topTerritories = territories.slice(0, 5);
  const max = Math.max(...topTerritories.map(item => item.icts), 1);
  return `<div class="page kit-home v1-page">
    <section class="kit-welcome"><div class="wrap">
      <div class="kit-page-meta"><span class="kit-environment"><i></i> Ambiente de demonstração</span></div>
      <div class="kit-hero-grid"><div class="kit-hero-copy"><h1>Conheça quem transforma<br>a Bahia pela inovação<span>.</span></h1><p>Encontre Núcleos de Inovação Tecnológica, conheça suas instituições e explore as conexões em cada território.</p>
      <form id="home-search-form" class="kit-search" role="search"><label class="sr-only" for="home-search">Buscar NIT ou instituição</label><span aria-hidden="true">⌕</span><input id="home-search" type="search" placeholder="Busque por NIT, instituição ou município" maxlength="120"><button class="button" type="submit">Explorar a base <span aria-hidden="true">→</span></button></form>
      <div class="kit-search-hints"><span>Explore por instituição:</span>${['UFBA','UEFS','UESC','UNEB'].map(name => `<a href="#nits/busca/${name}">${name} <span aria-hidden="true">↗</span></a>`).join('')}</div></div>
      <aside class="kit-territory-spot"><div class="kit-orbit" aria-hidden="true"><i></i><i></i><i></i><b>BA</b><span class="orbit-dot one"></span><span class="orbit-dot two"></span><span class="orbit-dot three"></span></div><div><strong>Um estado.<br>Muitas conexões.</strong><p>27 Territórios de Identidade para descobrir.</p><a href="#territorios">Explorar os territórios <span aria-hidden="true">→</span></a></div></aside></div>
    </div></section>
    <section class="kit-dashboard wrap" aria-label="Panorama da amostra"><div class="kit-stat-grid">${metrics.map(([route, value, label, detail, symbol]) => `<a class="kit-stat" href="#${route}"><div><span>${label}</span><i aria-hidden="true">${symbol}</i></div><strong>${value.toLocaleString('pt-BR')}</strong><small>${detail}</small></a>`).join('')}</div>
      <div class="kit-section-heading"><div><h2>A inovação tem muitos caminhos</h2></div><p>Escolha como você quer conhecer a rede.</p></div>
      <div class="kit-paths"><a href="#nits"><span class="kit-path-icon" aria-hidden="true">N</span><span><b>Encontre um NIT</b><small>Atuação, situação e instituição vinculada.</small></span><span aria-hidden="true">↗</span></a><a href="#pesquisadores"><span class="kit-path-icon" aria-hidden="true">P</span><span><b>Conheça os pesquisadores</b><small>Pessoas, competências e conexões.</small></span><span aria-hidden="true">↗</span></a><a href="#propriedade"><span class="kit-path-icon" aria-hidden="true">PI</span><span><b>Explore a propriedade intelectual</b><small>Patentes, softwares e outros ativos.</small></span><span aria-hidden="true">↗</span></a></div>
      <div class="kit-insight-grid"><section class="kit-panel"><div class="kit-panel-heading"><div><h2>Inovação pelo estado</h2></div><a class="text-link" href="#territorios">Ver mapa <span aria-hidden="true">↗</span></a></div><p class="kit-panel-caption">Instituições da amostra com presença em cada território.</p><div class="kit-territory-bars">${topTerritories.map(item => `<a href="#nits/territorio/${encodeURIComponent(item.name)}"><span>${item.name}</span><b>${item.icts}</b><i style="--bar-width:${item.icts / max * 100}%"></i></a>`).join('')}</div><p class="kit-footnote">Uma instituição pode estar em vários territórios. Presença institucional e cobertura do NIT são informações diferentes.</p></section>
      <section class="kit-panel kit-directory"><div class="kit-panel-heading"><div><h2>Parte dessa rede</h2></div><a class="text-link" href="#instituicoes">Ver todas <span aria-hidden="true">↗</span></a></div><div class="kit-directory-list">${demoNits.slice(0, 4).map(item => `<a href="#perfil/${item.id}">${institutionLogo(item.acronym, 'compact')}<span><b>${item.acronym}</b><small>${item.institution}</small></span><span aria-hidden="true">→</span></a>`).join('')}</div><a class="kit-directory-footer" href="#nits">Consultar os ${demoNits.length} NITs <span aria-hidden="true">→</span></a></section></div>
      <aside class="kit-data-note"><span class="kit-note-icon" aria-hidden="true">i</span><p><b>Uma base em construção, com transparência.</b> Os registros operacionais deste protótipo são demonstrativos. Conheça as fontes previstas e os critérios de leitura.</p><a href="#fontes">Fontes e metodologia <span aria-hidden="true">↗</span></a></aside>
    </section></div>`;
}

function subpageHero(route, description, count) {
  return `<section class="subpage-hero"><div class="wrap"><nav class="kit-breadcrumb" aria-label="Caminho da página"><a href="#inicio">Início</a><span aria-hidden="true">/</span><span>${pageNames[route]}</span></nav><div class="subpage-title"><div><h1>${pageNames[route]}</h1><p class="lede">${description}</p></div>${count ? `<div class="count-card"><strong>${count}</strong><span>registros na amostra</span><small>Dados demonstrativos</small></div>` : ''}</div></div></section>`;
}

function nitsPage() {
  return `<div class="page">${subpageHero('nits','Cada registro reúne a instituição e seu NIT principal, com sede, territórios de atuação, modelo, situação e indicadores.', '12')}<section class="page-body"><div class="wrap"><div class="toolbar rich-toolbar catalog-toolbar"><label class="grow">Buscar instituição ou NIT<input id="nit-search" placeholder="Ex.: UESC, CINOVA, Salvador"></label><label>Território de atuação<select id="nit-territory"><option value="">Todos</option>${territoryNames.map(v=>`<option>${v}</option>`).join('')}</select></label><label>Natureza<select id="nit-nature"><option value="">Todas</option>${[...new Set(demoNits.map(n=>n.nature))].map(v=>`<option>${v}</option>`).join('')}</select></label><label>Situação<select id="nit-status"><option value="">Todas</option>${[...new Set(demoNits.map(n=>n.status))].map(v=>`<option>${v}</option>`).join('')}</select></label><label>Modelo do NIT<select id="nit-model"><option value="">Todos</option>${[...new Set(demoNits.map(n=>n.model))].map(v=>`<option>${v}</option>`).join('')}</select></label></div><div class="result-line"><span id="nit-result-count">${demoNits.length} instituições e NITs exibidos</span><div><button class="view-button active" type="button">Lista</button><button class="view-button" type="button">Mapa</button></div></div><div id="nit-catalog" class="card-grid nit-grid">${demoNits.map(nitCard).join('')}</div><div id="nit-empty" class="empty-state" hidden><b>Nenhum registro encontrado</b><span>Revise a busca ou os filtros selecionados.</span></div></div></section></div>`;
}

function v1NitCard(item) {
  return `<a class="entity-card nit-card v1-nit-card" href="#perfil/${item.id}" aria-label="Abrir cadastro do ${item.name}"><div class="card-top logo-card-top">${institutionLogo(item.acronym, 'compact')}<span class="status-dot ${item.status === 'Ativo' ? 'ok' : 'warn'}">${item.status}</span></div><span class="entity-kicker">${item.acronym} · ${item.nature}</span><h3>${item.name}</h3><p class="nit-institution">${item.institution}</p><div class="kit-card-meta"><span>⌖ ${item.municipality}</span><span>${item.model}</span></div><div class="kit-card-bottom"><span>${territorySummary(item)}</span><b>Conhecer o NIT <span aria-hidden="true">↗</span></b></div></a>`;
}

function v1NitsPage() {
  return `<div class="page v1-page kit-catalog-page">${subpageHero('nits','Descubra os núcleos, suas instituições e a presença territorial. Use os filtros para encontrar o que procura.', String(demoNits.length))}<section class="page-body"><div class="wrap">
    <div class="kit-context-line"><span><i></i> Consulta aos registros demonstrativos</span><a href="#instituicoes">Explorar instituições <span aria-hidden="true">→</span></a></div>
    <form class="toolbar rich-toolbar catalog-toolbar kit-filter-form" role="search"><label class="grow">Buscar NIT ou instituição<input id="nit-search" type="search" maxlength="120" placeholder="Nome, sigla ou município"></label><label>Território<select id="nit-territory"><option value="">Todos os territórios</option>${[...territoryNames].sort((a,b)=>a.localeCompare(b,'pt-BR')).map(v=>`<option>${v}</option>`).join('')}</select></label><label>Natureza<select id="nit-nature"><option value="">Todas</option>${[...new Set(demoNits.map(n=>n.nature))].map(v=>`<option>${v}</option>`).join('')}</select></label><label>Situação<select id="nit-status"><option value="">Todas</option>${[...new Set(demoNits.map(n=>n.status))].map(v=>`<option>${v}</option>`).join('')}</select></label><label>Modelo<select id="nit-model"><option value="">Todos</option>${[...new Set(demoNits.map(n=>n.model))].map(v=>`<option>${v}</option>`).join('')}</select></label></form>
    <div class="kit-filter-feedback"><div id="nit-active-filters" class="kit-filter-chips" aria-label="Filtros aplicados"></div><button type="button" class="kit-reset" id="nit-reset" hidden>Limpar filtros</button></div>
    <div class="result-line"><span id="nit-result-count" role="status" aria-live="polite"></span><div class="kit-view-tools"><label class="kit-sort">Ordenar<select id="nit-sort"><option value="name">Nome da instituição</option><option value="city">Município</option><option value="status">Situação</option></select></label><div class="kit-view-switch" role="group" aria-label="Visualização dos NITs"><button class="view-button active" type="button" aria-pressed="true">Lista</button><button class="view-button" type="button" aria-pressed="false">Mapa</button></div></div></div>
    <div id="nit-catalog" class="card-grid nit-grid">${demoNits.map(v1NitCard).join('')}</div><div id="nit-empty" class="empty-state" hidden><span class="kit-empty-icon" aria-hidden="true">⌕</span><b>Nenhum NIT encontrado</b><span>Tente outro nome ou remova os filtros para ampliar sua busca.</span><button class="button secondary" type="button" data-reset-nits>Limpar busca e filtros</button></div>
    <p class="kit-footnote">Os territórios indicam a presença das instituições. A área de atendimento de cada NIT depende de validação.</p>
  </div></section></div>`;
}

function selectedProfileItem() {
  const id = location.hash.split('/')[1] || 'uefs';
  return demoNits.find(item => item.id === id) || demoNits[1];
}

function profilePanel(item, key = 'sobre') {
  const relatedResearchers = researchers.filter(r => r.institution.includes(item.acronym) || r.nits.some(n => n.toLowerCase().includes(item.acronym.toLowerCase())));
  const profileResearchers = relatedResearchers;
  const relatedTechnologies = technologies.filter(t => t.institution === item.acronym || (item.acronym === 'CIMATEC' && t.institution === 'SENAI CIMATEC'));
  const profileTechnologies = relatedTechnologies;
  const relatedProperty = intellectualProperty.filter(record => record[3] === item.acronym || (item.acronym === 'CIMATEC' && record[3] === 'SENAI CIMATEC'));
  const panels = {
    sobre: `<div class="detail-grid"><section><h2>Instituição e NIT</h2><p><b>${item.institution}</b> é apresentada junto ao seu núcleo principal, <b>${item.name}</b>. Assim, o perfil reúne em uma única página a identificação institucional e a atuação do NIT.</p><h3>Principais atribuições do NIT</h3><ul class="check-list"><li>Gerir a política institucional de inovação</li><li>Apoiar proteção de propriedade intelectual</li><li>Promover transferência de tecnologia</li><li>Orientar pesquisadores e inventores</li><li>Articular parcerias com empresas e governo</li></ul></section><section><h3>Identificação e presença territorial</h3><dl class="definition-list"><div><span>Instituição</span>${item.institution}</div><div><span>NIT principal</span>${item.name}</div><div><span>Modelo</span>${item.model}</div><div><span>Sede administrativa</span>${item.municipality}</div><div><span>Endereço da sede</span>${item.headquartersAddress}</div><div class="territory-definition"><span>Campi e localidades</span>${locationChips(item)}</div><div class="territory-definition"><span>Presença institucional por território</span>${territoryChips(item)}</div><div><span>Cobertura de atendimento do NIT</span><i class="coverage-validation">${item.nitCoverageStatus}</i></div><div><span>Natureza</span>${item.nature}</div></dl></section></div>${unitPresenceTable(item)}`,
    indicadores: `<h2>Indicadores da instituição e do NIT</h2><p class="panel-note">Valores fictícios usados somente para testar a organização da tela.</p><div class="metric-grid compact">${metric(String(item.researchers),'Pesquisadores','vínculos demonstrativos','P')}${metric(String(item.technologies),'Tecnologias','portfólio demonstrativo','TC')}${metric(String(item.pi),'Ativos de PI','acervo demonstrativo','PI')}${metric(String(Math.max(3, Math.round(item.technologies / 4))),'Parcerias','vigentes no exemplo','↔')}</div><div class="chart-card"><h3>Evolução de ativos de PI</h3><div class="data-bars labeled"><i style="height:38%"><span>2022</span></i><i style="height:49%"><span>2023</span></i><i style="height:63%"><span>2024</span></i><i style="height:78%"><span>2025</span></i><i style="height:88%"><span>2026</span></i></div></div>`,
    pesquisadores: `<h2>Pesquisadores relacionados</h2><p class="panel-note">Um pesquisador pode participar de mais de um NIT quando houver projeto ou vínculo interinstitucional.</p><div class="compact-table"><div class="table-row table-head"><span>Pesquisador</span><span>Área</span><span>Vínculo</span><span>Projetos</span></div>${profileResearchers.map(r=>`<div class="table-row"><span><b>${r.name}</b><small>${r.institution}</small></span><span>${r.area}</span><span>${r.nits.join(' · ')}</span><span>${r.projects}</span></div>`).join('')}</div>`,
    tecnologias: `<h2>Tecnologias relacionadas</h2><div class="mini-card-grid">${profileTechnologies.map(t=>`<article><span class="tag">${t.category} · ${t.stage}</span><h3>${t.title}</h3><p>${t.area} · ${t.status}</p></article>`).join('')}</div>`,
    propriedade: `<h2>Propriedade intelectual</h2><p class="panel-note">Ativos associados à instituição e acompanhados pelo NIT responsável.</p><div class="metric-grid compact">${metric(String(item.pi),'Ativos de PI','total associado ao perfil','PI')}${metric(String(Math.round(item.pi * .45)),'Patentes','estimativa da composição','PT')}${metric(String(Math.round(item.pi * .29)),'Softwares','estimativa da composição','SW')}${metric(String(Math.max(0,item.pi - Math.round(item.pi * .45) - Math.round(item.pi * .29))),'Outros ativos','marcas e demais categorias','+')}</div>${relatedProperty.length ? `<div class="compact-table property-profile-table"><div class="table-row table-head"><span>Identificador</span><span>Tipo e título</span><span>Situação</span><span>Ano</span></div>${relatedProperty.map(record=>`<div class="table-row"><span><b>${record[0]}</b></span><span><b>${record[1]}</b><small>${record[2]}</small></span><span>${record[4]}</span><span>${record[5]}</span></div>`).join('')}</div>` : '<div class="empty-state profile-empty"><b>Sem registros detalhados nesta amostra</b><span>A estrutura está pronta para receber patentes, softwares, marcas e outros ativos vinculados ao perfil.</span></div>'}`,
    servicos: `<div class="services-layout"><section><h2>Serviços do NIT</h2><div class="service-grid"><article><b>Propriedade intelectual</b><span>Orientação, busca de anterioridade e apoio ao depósito.</span></article><article><b>Transferência de tecnologia</b><span>Apoio à negociação, licenciamento e parcerias.</span></article><article><b>Empreendedorismo</b><span>Programas, ambientes de inovação e conexão com empresas.</span></article><article><b>Formação</b><span>Oficinas, trilhas e eventos para a comunidade acadêmica.</span></article></div></section><aside><h3>Estrutura de atendimento</h3><ul class="team-role-list"><li>Coordenação do NIT</li><li>Propriedade intelectual</li><li>Transferência e parcerias</li><li>Apoio administrativo</li></ul>${item.site ? `<a class="button secondary full" href="${item.site}" target="_blank" rel="noreferrer">Consultar canais oficiais</a>` : '<p class="panel-note">Canais institucionais a integrar.</p>'}</aside></div>`,
    formacao: `<h2>Formação e capacitação</h2><div class="timeline"><article><b>Oficina de busca de anterioridade</b><span>24 participantes · 8 horas · 2026</span></article><article><b>Trilha de propriedade intelectual</b><span>3 módulos · 64 concluintes · 2026</span></article><article><b>Formação para ambientes de inovação</b><span>2 turmas · 41 concluintes · 2025</span></article></div>`,
    eventos: `<h2>Eventos e articulações</h2><div class="timeline"><article><b>Encontro territorial de inovação</b><span>Feira de Santana · evento demonstrativo</span></article><article><b>Rodada ICT–empresa</b><span>12 organizações participantes · dado fictício</span></article><article><b>Seminário da Rede-NIT</b><span>Agenda integrada · dado fictício</span></article></div>`,
    fontes: `<h2>Fontes e atualização</h2><div class="source-cards"><article><b>Site institucional</b><span>Descrição, serviços e contatos</span><small>Validação necessária</small></article><article><b>DataNIT</b><span>Nome do NIT, instituição, UF e links</span><small>Consulta pública</small></article><article><b>Integrações futuras</b><span>Pesquisadores, PI, projetos e indicadores</span><small>Contrato ainda a definir</small></article></div>`
  };
  if (siteVersion === 'v1') {
    panels.sobre = `<div class="detail-grid"><section><h2>Instituição e NIT relacionado</h2><p><b>${item.institution}</b> e <b>${item.name}</b> são cadastros distintos ligados entre si. A instituição possui, no máximo, um NIT; instituições sem NIT identificado também podem permanecer na base.</p><h3>Informações do NIT</h3><dl class="definition-list"><div><span>Nome</span>${item.name}</div><div><span>Modelo</span>${item.model}</div><div><span>Situação</span>${item.status}</div><div><span>Município informado</span>${item.municipality}</div></dl></section><section><h3>Instituição</h3><dl class="definition-list"><div><span>Nome</span>${item.institution}</div><div><span>Natureza</span>${item.nature}</div><div><span>Sede administrativa</span>${item.municipality}</div><div><span>Endereço da sede</span>${item.headquartersAddress}</div><div class="territory-definition"><span>Unidades/localidades</span>${locationChips(item)}</div><div class="territory-definition"><span>Presença territorial</span>${territoryChips(item)}</div></dl></section></div>${unitPresenceTable(item)}`;
    panels.indicadores = `<h2>Indicadores disponíveis na V1</h2><p class="panel-note">Dados ausentes não são convertidos automaticamente em zero. Cada valor deverá conservar fonte e período de referência.</p><div class="metric-grid compact">${metric(String(item.researchers),'Pesquisadores','pessoas sem duplicidade','P')}${metric(String(item.pi),'Registros de PI','associados à instituição','PI')}${metric(String(item.territories.length),'Territórios com presença','sede, campus ou unidade','T')}</div>`;
    panels.propriedade = `<h2>Propriedade intelectual</h2><p class="panel-note">Os registros abaixo são associados à instituição. O vínculo direto com o NIT somente deverá aparecer quando houver evidência na fonte.</p>${relatedProperty.length ? `<div class="compact-table property-profile-table"><div class="table-row table-head"><span>Identificador</span><span>Tipo e título</span><span>Situação</span><span>Ano</span></div>${relatedProperty.map(record=>`<div class="table-row"><span><b>${record[0]}</b></span><span><b>${record[1]}</b><small>${record[2]}</small></span><span>${record[4]}</span><span>${record[5]}</span></div>`).join('')}</div>` : '<div class="empty-state profile-empty"><b>Sem registros detalhados nesta amostra</b><span>A ausência de registros não será interpretada como quantidade zero.</span></div>'}`;
  }
  if (!profileResearchers.length) panels.pesquisadores = '<h2>Pesquisadores relacionados</h2><div class="empty-state profile-empty"><b>Sem vínculos detalhados nesta amostra</b><span>Nenhum perfil de pesquisador está associado a esta instituição nos registros demonstrativos disponíveis.</span></div>';
  if (!profileTechnologies.length) panels.tecnologias = '<h2>Tecnologias relacionadas</h2><div class="empty-state profile-empty"><b>Sem tecnologias detalhadas nesta amostra</b><span>Nenhuma tecnologia está associada a esta instituição nos registros demonstrativos disponíveis.</span></div>';
  return panels[key] || panels.sobre;
}

function profilePage() {
  const item = selectedProfileItem();
  const sourceLink = item.site ? `<a class="button secondary" href="${item.site}" target="_blank" rel="noreferrer">Acessar fonte pública</a>` : '<span></span>';
  const description = siteVersion === 'v1'
    ? 'Cadastro integrado da instituição, do NIT relacionado, da presença territorial e dos vínculos confirmados da V1.'
    : 'Perfil integrado com instituição, NIT principal, presença territorial, indicadores, pessoas, tecnologias, propriedade intelectual, serviços, agenda e fontes.';
  const backLabel = siteVersion === 'v1' ? 'Voltar para Instituições' : 'Voltar para Instituições e NITs';
  const tabs = siteVersion === 'v1'
    ? `<button class="active" data-profile-tab="sobre">Sobre</button><button data-profile-tab="indicadores">Indicadores</button><button data-profile-tab="pesquisadores">Pesquisadores</button><button data-profile-tab="propriedade">Propriedade intelectual</button><button data-profile-tab="fontes">Fontes</button>`
    : `<button class="active" data-profile-tab="sobre">Sobre</button><button data-profile-tab="indicadores">Indicadores</button><button data-profile-tab="pesquisadores">Pesquisadores</button><button data-profile-tab="tecnologias">Tecnologias</button><button data-profile-tab="propriedade">Propriedade intelectual</button><button data-profile-tab="servicos">Serviços e equipe</button><button data-profile-tab="formacao">Formação</button><button data-profile-tab="eventos">Eventos</button><button data-profile-tab="fontes">Fontes</button>`;
  return `<div class="page ${siteVersion === 'v1' ? 'v1-page' : ''}">${subpageHero('perfil',description)}<section class="page-body"><div class="wrap"><a class="button secondary back-button" href="${siteVersion === 'v1' ? '#instituicoes' : '#nits'}">${backLabel}</a><div class="profile-hero detailed">${institutionLogo(item.acronym, 'profile')}<div><div class="meta"><span class="tag">${item.nature}</span><span class="tag">NIT ${item.model.toLowerCase()}</span></div><h2 class="profile-institution-title">${item.institution}</h2><p class="lede">${item.name}</p><div class="profile-meta"><span>Sede: ${item.municipality}</span><span>${item.locations.length} localidade${item.locations.length === 1 ? '' : 's'}</span><span>${territorySummary(item)}</span><span>${item.status}</span></div></div>${sourceLink}</div><div class="profile-tabs" role="tablist">${tabs}</div><article class="content-panel profile-panel" data-profile-panel>${profilePanel(item)}</article></div></section></div>`;
}

function institutionsPage() {
  return `<div class="page v1-page kit-catalog-page">${subpageHero('instituicoes','Conheça as organizações da amostra, suas sedes, localidades e o NIT relacionado.', String(institutions.length))}<section class="page-body"><div class="wrap"><div class="toolbar rich-toolbar kit-institution-filters"><label class="grow">Buscar instituição<input id="institution-search" type="search" placeholder="Nome, sigla ou município" maxlength="120"></label><label>Natureza<select id="institution-nature"><option value="">Todas</option>${[...new Set(institutions.map(i=>i.nature))].map(value=>`<option>${value}</option>`).join('')}</select></label><label>Território<select id="institution-territory"><option value="">Todos os territórios</option>${[...territoryNames].sort((a,b)=>a.localeCompare(b,'pt-BR')).map(value=>`<option>${value}</option>`).join('')}</select></label></div><div class="result-line"><span id="institution-result-count" role="status" aria-live="polite"></span><button type="button" class="kit-reset" id="institution-reset" hidden>Limpar filtros</button></div><div class="card-grid institution-grid">${institutions.map(i=>`<a class="entity-card institution-card" href="#perfil/${i.id}"><div class="institution-logo-stage">${institutionLogo(i.initials, 'card')}</div><span class="tag institution-nature">${i.nature}</span><div class="institution-card-data"><p class="entity-kicker">${i.initials}</p><h3>${i.name}</h3><p>Sede: ${i.municipality}</p><dl class="mini-stats"><div><dt>Localidades</dt><dd>${i.units}</dd></div><div><dt>Territórios</dt><dd>${i.territories.length}</dd></div></dl><div class="linked-record"><span>NIT relacionado</span><b>${i.nit}</b></div><span class="card-open-action">Conhecer a instituição <span aria-hidden="true">↗</span></span></div></a>`).join('')}</div><div class="empty-state" id="institution-empty" hidden><b>Nenhuma instituição encontrada</b><span>Revise o termo pesquisado ou limpe os filtros.</span></div></div></section></div>`;
}

function territoriesPage() {
  return `<div class="page">${subpageHero('territorios','Presença das instituições e NITs nos 27 Territórios de Identidade, permitindo observar sedes, campi, unidades e interiorização.', '27')}<section class="page-body"><div class="wrap"><div class="territory-layout official-territory-page"><section class="map-panel large"><div class="panel-head"><div><h2>Presença institucional por território</h2><p>Os polígonos usam a camada vetorial oficial da SEI Bahia.</p></div></div><div class="territory-page-map-stage"><svg data-official-territory-map viewBox="0 0 620 680" role="group" aria-label="Mapa dos 27 Territórios de Identidade"><text x="310" y="330" text-anchor="middle">Carregando mapa oficial…</text></svg></div><p class="official-map-source">Fonte cartográfica: Superintendência de Estudos Econômicos e Sociais da Bahia — SEI.</p></section><aside class="content-panel"><h3>Duas camadas diferentes</h3><dl class="coverage-definition"><div><dt>Presença institucional</dt><dd>Sede, campus ou unidade localizada no território. É a camada exibida agora.</dd></div><div><dt>Cobertura do NIT</dt><dd>Área efetivamente atendida pelo núcleo. Será validada com cada instituição e não deve ser presumida pela localização dos campi.</dd></div></dl><a class="button secondary full" href="#nits">Abrir catálogo e filtros</a></aside></div><div class="territory-cards">${territories.map(t=>`<a href="#nits/territorio/${encodeURIComponent(t.name)}"><i style="background:${t.color}"></i><div><h3>${t.name}</h3><p>${t.municipalities}</p></div><dl><div><dt>NITs presentes</dt><dd>${t.nits}</dd></div><div><dt>ICTs</dt><dd>${t.icts}</dd></div><div><dt>Pesquisadores</dt><dd>${t.researchers}</dd></div></dl></a>`).join('')}</div></div></section></div>`;
}

function researchersPage() {
  return `<div class="page">${subpageHero('pesquisadores','Pessoas, competências, instituição de vínculo, projetos e participações em NITs. Os perfis abaixo são totalmente fictícios.', String(researchers.length))}<section class="page-body"><div class="wrap"><div class="toolbar rich-toolbar"><label class="grow">Nome ou competência<input placeholder="Biotecnologia, energia, software..."></label><label>Instituição<select><option>Todas</option>${[...new Set(researchers.map(r=>r.institution))].map(v=>`<option>${v}</option>`).join('')}</select></label><label>NIT<select><option>Todos</option>${[...new Set(researchers.flatMap(r=>r.nits))].map(v=>`<option>${v}</option>`).join('')}</select></label></div><div class="researcher-grid">${researchers.map((r,i)=>`<article class="researcher-card"><div class="researcher-photo-placeholder" aria-label="Espaço reservado para a fotografia do pesquisador"><span>P${String(i+1).padStart(2,'0')}</span><small>Foto do perfil</small></div><div class="researcher-card-content"><span class="tag">Perfil fictício</span><h3>${r.name}</h3><p>${r.area}</p><div class="profile-meta institution-affiliation">${institutionLogo(r.institution === 'SENAI CIMATEC' ? 'CIMATEC' : r.institution, 'inline')}<span>${r.institution}</span><span>${r.projects} projetos</span><span>${r.productions} produções</span></div><div class="nit-links"><b>Participa de:</b>${r.nits.map(n=>`<span>${n}</span>`).join('')}</div></div></article>`).join('')}</div></div></section></div>`;
}

function technologiesPage() {
  return `<div class="page">${subpageHero('tecnologias','Portfólio de soluções com área, categoria, maturidade, instituição titular, NIT responsável e disponibilidade para parceria.', String(technologies.length))}<section class="page-body"><div class="wrap"><div class="toolbar"><label>Categoria<select><option>Todas</option><option>Patente</option><option>Software</option></select></label><label>Área<select><option>Todas</option>${[...new Set(technologies.map(t=>t.area))].map(v=>`<option>${v}</option>`).join('')}</select></label><label>Estágio<select><option>Todos os TRLs</option><option>TRL 4–6</option><option>TRL 7–9</option></select></label></div><div class="card-grid tech-grid">${technologies.map((t,i)=>`<article class="feature-card technology-card"><div class="card-top">${icon(String(i+1).padStart(2,'0'))}<span class="tag">${t.category}</span></div><h3>${t.title}</h3><p>${t.area}</p><div class="technology-stage"><b>${t.stage}</b><span>${t.status}</span></div><dl class="definition-list"><div><span>Instituição titular</span><span class="field-with-logo">${institutionLogo(t.institution, 'inline')}<b>${t.institution}</b></span></div><div><span>NIT responsável</span>${t.nit}</div></dl><a class="text-link" href="#perfil/${demoNits.find(n=>n.acronym === t.institution || (n.acronym === 'CIMATEC' && t.institution === 'SENAI CIMATEC'))?.id || ''}">Ver instituição e NIT →</a></article>`).join('')}</div></div></section></div>`;
}

function propertyPage() {
  const byType = type => intellectualProperty.filter(record => record[1] === type).length;
  const other = intellectualProperty.length - byType('Patente') - byType('Software') - byType('Marca');
  return `<div class="page">${subpageHero('propriedade','Ativos protegidos ou em proteção: patentes, programas de computador, marcas, desenhos industriais e cultivares.', String(intellectualProperty.length))}<section class="page-body"><div class="wrap"><div class="metric-grid compact">${metric(String(byType('Patente')),'Patentes','registros desta amostra','PT')}${metric(String(byType('Software')),'Softwares','registros desta amostra','SW')}${metric(String(byType('Marca')),'Marcas','registros desta amostra','MR')}${metric(String(other),'Outros ativos','desenho industrial e cultivar','+')}</div><div class="toolbar"><label>Tipo<select><option>Todos</option>${[...new Set(intellectualProperty.map(record=>record[1]))].map(value=>`<option>${value}</option>`).join('')}</select></label><label>Situação<select><option>Todas</option>${[...new Set(intellectualProperty.map(record=>record[4]))].map(value=>`<option>${value}</option>`).join('')}</select></label><label>Ano<select><option>Todos os anos</option>${[...new Set(intellectualProperty.map(record=>record[5]))].sort().reverse().map(value=>`<option>${value}</option>`).join('')}</select></label></div><div class="compact-table property-table"><div class="table-row table-head"><span>Identificador</span><span>Tipo / Título</span><span>Titular</span><span>Situação</span><span>Ano</span></div>${intellectualProperty.map(p=>`<div class="table-row"><span><b>${p[0]}</b><small>Identificador fictício</small></span><span><b>${p[1]}</b><small>${p[2]}</small></span><span>${p[3]}</span><span><i class="status-dot ${p[4].includes('Registr') || p[4].includes('Conced') ? 'ok' : 'warn'}">${p[4]}</i></span><span>${p[5]}</span></div>`).join('')}</div></div></section></div>`;
}

function indicatorsPage() {
  return `<div class="page">${subpageHero('indicadores','Painel de leitura por período, NIT, instituição, território e categoria, com distribuição, evolução e detalhamento dos resultados.')}<section class="page-body"><div class="wrap"><div class="indicator-context"><div><h2>Panorama do ecossistema</h2><p>Os indicadores estão organizados em capacidade, resultados, conexões e cobertura territorial.</p></div><label>Ano-base<select><option>2026</option><option>2025</option><option>2024</option></select></label></div><div class="indicator-axis"><span class="active">Visão geral</span><span>Capacidade de pesquisa</span><span>Tecnologias e PI</span><span>Conexões</span><span>Cobertura territorial</span></div><div class="metric-grid">${metric('12','NITs','10 ativos · 2 em consolidação','N')}${metric('1.284','Pesquisadores','vínculos sem duplicar pessoas','P')}${metric('167','Tecnologias','portfólio demonstrativo','TC')}${metric('328','Ativos de PI','estoque demonstrativo','PI')}${metric('42','Parcerias','vigentes no período','↔')}${metric('24','Eventos','ações registradas','E')}</div><div class="indicator-grid"><section class="content-panel chart-card"><div class="panel-head"><div><h2>Novos ativos de PI</h2></div><span class="tag">2022–2026</span></div><div class="data-bars labeled"><i style="height:35%"><span>2022</span></i><i style="height:48%"><span>2023</span></i><i style="height:56%"><span>2024</span></i><i style="height:72%"><span>2025</span></i><i style="height:88%"><span>2026</span></i></div></section><section class="content-panel"><h2>Ativos por tipo</h2><div class="donut-row"><div class="donut"><span>328<small>ativos</small></span></div><ul><li><i style="background:#2453e6"></i>Patentes <b>45%</b></li><li><i style="background:#a34da6"></i>Software <b>29%</b></li><li><i style="background:#078174"></i>Marcas <b>16%</b></li><li><i style="background:#d88416"></i>Outros <b>10%</b></li></ul></div></section></div><div class="indicator-notes"><b>Unidade de leitura:</b><span>um indicador por NIT, instituição, território e período.</span><b>Informações essenciais:</b><span>unidade, fonte, data de coleta, lote e regra de cálculo.</span></div><section class="data-dictionary"><div class="panel-head"><div><h2>Como interpretar os indicadores</h2></div></div><div class="dictionary-grid"><article><b>NIT único</b><span>Núcleo contado uma vez no total geral, independentemente de quantos territórios alcance.</span></article><article><b>Presença territorial</b><span>Vínculo entre uma instituição e um território por sede, campus ou unidade.</span></article><article><b>Cobertura do NIT</b><span>Área efetivamente atendida pelo núcleo; deve ser validada separadamente da presença de campi.</span></article><article><b>Pesquisador</b><span>Pessoa identificada sem duplicidade, podendo possuir vários vínculos institucionais.</span></article><article><b>Ativo de PI</b><span>Patente, software, marca, desenho industrial, cultivar ou outra proteção registrada.</span></article><article><b>Período de referência</b><span>Ano ou intervalo ao qual o valor se refere, acompanhado por fonte e data de atualização.</span></article></div></section></div></section></div>`;
}

function v1IndicatorsPage() {
  const active = demoNits.filter(item=>item.status === 'Ativo').length;
  return `<div class="page v1-page">${subpageHero('indicadores','Uma leitura transparente dos registros disponíveis no protótipo. Os totais abaixo são calculados a partir da amostra.')}<section class="page-body"><div class="wrap"><div class="metric-grid">${metric(String(demoNits.length),'NITs na amostra',`${active} ativos e ${demoNits.length-active} em consolidação`,'N')}${metric(String(institutions.length),'Instituições','registros disponíveis para consulta','I')}${metric(String(researchers.length),'Perfis de pesquisadores','pessoas fictícias detalhadas na amostra','P')}${metric(String(intellectualProperty.length),'Registros de PI','registros detalhados na amostra','PI')}${metric(String(territoryNames.length),'Territórios','camada cartográfica disponível','T')}${metric(String(territorialPresenceTotal),'Vínculos territoriais','uma instituição pode ter vários vínculos','↗')}</div><section class="section-block"><h2>Números com contexto</h2><div class="dictionary-grid"><article><b>Contagem de registros</b><span>Os totais refletem os registros que você pode consultar nesta amostra, sem representar o universo real da Bahia.</span></article><article><b>Presença territorial</b><span>Sede, campus ou unidade vinculada a um território. Não equivale à área de atendimento do NIT.</span></article><article><b>Dados ausentes</b><span>Ausência de informação não significa zero. Uma base real deverá conservar fonte, período e data de coleta.</span></article></div></section><aside class="kit-data-note"><span class="kit-note-icon" aria-hidden="true">i</span><p><b>Indicadores institucionais simulados.</b> Os números dos perfis são exemplos de apresentação e não correspondem a uma coleta oficial.</p><a href="#fontes">Consultar metodologia ↗</a></aside></div></section></div>`;
}

function eventsPage() {
  const events = [
    ['18 MAR','Encontro demonstrativo da Rede-NIT','Salvador · articulação institucional','Evento'],
    ['09 ABR','Oficina de propriedade intelectual','Feira de Santana · formação de pesquisadores','Formação'],
    ['22 MAI','Rodada de tecnologias para o setor produtivo','Ilhéus · conexão ICT–empresa','Negócios'],
    ['11 JUN','Seminário de indicadores de inovação','Vitória da Conquista · dados e avaliação','Seminário']
  ];
  return `<div class="page">${subpageHero('eventos','Agenda de eventos, formações, chamadas e ações de articulação promovidas pela rede. Datas e atividades são fictícias.', '24')}<section class="page-body"><div class="wrap event-list">${events.map(e=>`<article class="event-item"><div class="event-date">${e[0]}</div><div><span class="tag">${e[3]} · demonstrativo</span><h3>${e[1]}</h3><p>${e[2]}</p></div><button class="button secondary" type="button">Ver detalhes</button></article>`).join('')}</div></section></div>`;
}

function sourcesPage() {
  if (siteVersion === 'v1') {
    return `<div class="page v1-page">${subpageHero('fontes','Procedência, período de referência e critérios de integração dos registros da V1.')}<section class="page-body"><div class="wrap"><div class="source-cards large"><article><b>DataNIT</b><span>Identificação pública de instituições e NITs.</span><small>Fonte externa de referência</small></article><article><b>Sites institucionais</b><span>Sede, contatos, unidades e informações do NIT.</span><small>Validação institucional necessária</small></article><article><b>Integrações futuras</b><span>Pesquisadores, propriedade intelectual, municípios e territórios.</span><small>Dados ainda não integrados</small></article></div><section class="section-block"><div class="panel-head"><div><h2>Dicionário inicial da V1</h2></div></div><div class="compact-table dictionary-table"><div class="table-row table-head"><span>Entidade</span><span>Campos essenciais</span><span>Relacionamentos</span></div><div class="table-row"><b>NIT</b><span>nome, sigla, situação, site, município e atualização</span><span>exatamente uma instituição</span></div><div class="table-row"><b>Instituição</b><span>nome, sigla, natureza, sede e unidades</span><span>zero ou um NIT; pesquisadores e PI</span></div><div class="table-row"><b>Pesquisador</b><span>nome, Lattes, ORCID e área</span><span>múltiplos vínculos institucionais e PI</span></div><div class="table-row"><b>Propriedade intelectual</b><span>modalidade, processo, datas e situação</span><span>instituições e pesquisadores com papéis</span></div><div class="table-row"><b>Município / território</b><span>código IBGE, nome e Território de Identidade</span><span>sedes e unidades institucionais</span></div><div class="table-row"><b>Fonte</b><span>origem, URL, coleta, período e lote</span><span>registro importado ou validado</span></div></div></section></div></section></div>`;
  }
  return `<div class="page">${subpageHero('fontes','Transparência sobre origem, campos, coleta, transformação, atualização e limitações dos dados.')}<section class="page-body"><div class="wrap"><div class="source-cards large"><article><b>DataNIT</b><span>Instituição, sigla, UF, natureza administrativa, nome e link do NIT.</span><a href="https://datanit.netlify.app/" target="_blank" rel="noreferrer">Abrir referência ↗</a></article><article><b>Sites institucionais</b><span>Descrição, serviços, endereços, contatos, políticas e portfólios.</span><small>Validação com cada ICT</small></article><article><b>Observatório / integrações</b><span>Territórios, pesquisadores, projetos, indicadores e futuras cargas estruturadas.</span><small>Contrato técnico a definir</small></article></div><section class="section-block"><div class="panel-head"><div><h2>Principais entidades da base</h2></div>${demoLabel('Modelo conceitual')}</div><div class="compact-table dictionary-table"><div class="table-row table-head"><span>Entidade</span><span>Campos essenciais</span><span>Relacionamentos</span></div><div class="table-row"><b>NIT</b><span>nome, sigla, modelo, situação, site, contato, endereço, início da vigência</span><span>ICTs, pesquisadores, tecnologias, eventos, fontes</span></div><div class="table-row"><b>Instituição / ICT</b><span>nome, sigla, natureza, CNPJ opcional, unidades, município</span><span>NIT principal, unidades, pesquisadores</span></div><div class="table-row"><b>Pesquisador</b><span>identificador, nome, áreas, instituição, vínculo e vigência</span><span>NITs, projetos, tecnologias e ativos de PI</span></div><div class="table-row"><b>Tecnologia</b><span>título, resumo, área, TRL, disponibilidade, titularidade</span><span>NIT, ICT, pesquisadores e PI</span></div><div class="table-row"><b>Fonte</b><span>origem, URL, data de coleta, licença, lote e responsável</span><span>qualquer registro importado ou validado</span></div></div></section><section class="section-block"><div class="panel-head"><div><h2>Caminho de atualização</h2></div></div><div class="provenance-flow"><span>Fonte pública</span><i>→</i><span>Lote de coleta</span><i>→</i><span>Validação</span><i>→</i><span>Registro tratado</span><i>→</i><span>Indicador publicado</span></div><div class="warning-box"><b>Importante</b><p>Os números deste protótipo são fictícios. Os nomes públicos ajudam a testar a navegação, mas não constituem um cadastro oficial da Rede-NIT da Bahia.</p></div></section></div></section></div>`;
}

function sitemapPage() {
  const groups = siteVersion === 'v1' ? [
    ['Principal',['Início']],
    ['Cadastros',['NITs','Instituições','Pesquisadores','Propriedade intelectual','Territórios']],
    ['Dados',['Indicadores','Fontes e metodologia']]
  ] : [
    ['Principal',['Início']],
    ['Ecossistema',['Instituições e NITs','Territórios','Pesquisadores']],
    ['Inovação',['Tecnologias','Propriedade intelectual','Eventos e formação']],
    ['Dados',['Indicadores','Fontes e metodologia']]
  ];
  const routes = {'Início':'inicio','NITs':'nits','Instituições':'instituicoes','Instituições e NITs':'nits','Territórios':'territorios','Pesquisadores':'pesquisadores','Tecnologias':'tecnologias','Propriedade intelectual':'propriedade','Eventos e formação':'eventos','Indicadores':'indicadores','Fontes e metodologia':'fontes'};
  return `<div class="page">${subpageHero('mapa-do-site','Estrutura completa das áreas simuladas no protótipo.')}<section class="page-body"><div class="wrap sitemap-grid">${groups.map(([title,items])=>`<section class="sitemap-group"><h3>${title}</h3>${items.map(item=>`<a href="#${routes[item]}">${item}</a>`).join('')}</section>`).join('')}</div></section></div>`;
}

const generalRoutes = {
  inicio: homePage, nits: nitsPage, perfil: profilePage, instituicoes: nitsPage,
  territorios: territoriesPage, pesquisadores: researchersPage, tecnologias: technologiesPage,
  propriedade: propertyPage, indicadores: indicatorsPage, eventos: eventsPage,
  fontes: sourcesPage, 'mapa-do-site': sitemapPage
};

const v1Routes = {
  inicio: v1HomePage, nits: v1NitsPage, instituicoes: institutionsPage, perfil: profilePage,
  territorios: territoriesPage, pesquisadores: researchersPage, propriedade: propertyPage,
  indicadores: v1IndicatorsPage, fontes: sourcesPage, 'mapa-do-site': sitemapPage
};

const routes = siteVersion === 'v1' ? v1Routes : generalRoutes;

function currentRoute() {
  const route = (location.hash.replace('#','') || 'inicio').split('/')[0];
  return siteVersion === 'geral' && route === 'instituicoes' ? 'nits' : route;
}

function activateProfileTabs() {
  const tabs = [...app.querySelectorAll('[data-profile-tab]')];
  const panel = app.querySelector('[data-profile-panel]');
  if (!tabs.length || !panel) return;
  panel.id = 'profile-tab-panel';
  panel.setAttribute('role','tabpanel');
  panel.setAttribute('tabindex','0');
  const select = tab => {
    tabs.forEach(item=>{const active=item===tab; item.classList.toggle('active',active); item.setAttribute('aria-selected',String(active)); item.tabIndex=active?0:-1;});
    panel.setAttribute('aria-labelledby',tab.id);
    panel.innerHTML=profilePanel(selectedProfileItem(),tab.dataset.profileTab);
  };
  tabs.forEach((tab,index)=>{
    tab.type='button'; tab.id=`profile-tab-${tab.dataset.profileTab}`;
    tab.setAttribute('role','tab'); tab.setAttribute('aria-controls',panel.id);
    tab.addEventListener('click',()=>select(tab));
    tab.addEventListener('keydown',event=>{
      let next;
      if(event.key==='ArrowRight') next=(index+1)%tabs.length;
      if(event.key==='ArrowLeft') next=(index-1+tabs.length)%tabs.length;
      if(event.key==='Home') next=0;
      if(event.key==='End') next=tabs.length-1;
      if(next!==undefined){event.preventDefault();select(tabs[next]);tabs[next].focus();}
    });
  });
  select(tabs[0]);
}

const territoryMapPositions = {
  'Irecê': [48, 23], 'Velho Chico': [29, 31], 'Chapada Diamantina': [45, 39],
  'Sisal': [65, 31], 'Litoral Sul': [66, 72], 'Baixo Sul': [71, 62],
  'Extremo Sul': [64, 90], 'Médio Sudoeste da Bahia': [55, 69], 'Vale do Jiquiriçá': [61, 58],
  'Sertão do São Francisco': [66, 18], 'Bacia do Rio Grande': [22, 26], 'Bacia do Paramirim': [35, 50],
  'Sertão Produtivo': [43, 61], 'Piemonte do Paraguaçu': [55, 46], 'Bacia do Jacuípe': [60, 39],
  'Piemonte da Diamantina': [55, 29], 'Semiárido Nordeste II': [75, 29],
  'Litoral Norte e Agreste Baiano': [81, 43], 'Portal do Sertão': [70, 46],
  'Sudoeste Baiano': [48, 72], 'Recôncavo': [70, 54], 'Médio Rio de Contas': [56, 62],
  'Bacia do Rio Corrente': [25, 56], 'Itaparica': [76, 19], 'Piemonte Norte do Itapicuru': [62, 21],
  'Metropolitano de Salvador': [78, 53], 'Costa do Descobrimento': [68, 82]
};

const normalizeTerritory = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

async function renderOfficialTerritoryMap(mapView) {
  const svg = mapView.querySelector('[data-official-territory-map]');
  if (!svg) return;
  svg.setAttribute('aria-busy','true');
  mapView.querySelector('[data-map-retry]')?.remove();
  try {
    const response = await fetch('assets/data/territorios-identidade.geojson');
    if (!response.ok) throw new Error('GeoJSON indisponível');
    const geojson = await response.json();
    const bounds = { minX: -46.65, maxX: -37.30, minY: -18.38, maxY: -8.50 };
    const project = ([longitude, latitude]) => [
      18 + ((longitude - bounds.minX) / (bounds.maxX - bounds.minX)) * 584,
      16 + ((bounds.maxY - latitude) / (bounds.maxY - bounds.minY)) * 648
    ];
    const territoryLookup = new Map(territoryNames.map(name => [normalizeTerritory(name), name]));
    svg.innerHTML = '';
    geojson.features.forEach(feature => {
      const rawName = feature.properties.nm_ti || feature.properties.NM_TI;
      const name = territoryLookup.get(normalizeTerritory(rawName)) || rawName;
      const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
      let pointCount = 0;
      let centroidX = 0;
      let centroidY = 0;
      const pathData = polygons.map(polygon => polygon.map((ring, ringIndex) => ring.map((point, pointIndex) => {
        const [x, y] = project(point);
        if (ringIndex === 0) {
          centroidX += x;
          centroidY += y;
          pointCount += 1;
        }
        return `${pointIndex === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ') + ' Z').join(' ')).join(' ');
      const shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      shape.setAttribute('d', pathData);
      shape.setAttribute('class', 'official-territory-shape');
      shape.dataset.territoryShape = name;
      shape.setAttribute('tabindex', '0');
      shape.setAttribute('role', 'button');
      shape.setAttribute('aria-label', `Filtrar por ${name}`);
      const selectTerritory = () => {
        const territory = app.querySelector('#nit-territory');
        if (territory) {
          territory.value = name;
          territory.dispatchEvent(new Event('change'));
        } else {
          location.hash = `#nits/territorio/${encodeURIComponent(name)}`;
        }
      };
      shape.addEventListener('click', selectTerritory);
      shape.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectTerritory(); }
      });
      svg.appendChild(shape);
      if (pointCount) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', String(centroidX / pointCount));
        label.setAttribute('y', String(centroidY / pointCount));
        label.setAttribute('class', 'official-territory-count');
        label.dataset.territoryLabel = name;
        label.textContent = '0';
        svg.appendChild(label);
      }
    });
    applyTerritoryMapCounts(mapView, mapView._visibleItems || demoNits);
  } catch (error) {
    svg.innerHTML = '<text x="310" y="330" text-anchor="middle" class="map-load-error">Não foi possível carregar o mapa territorial.</text>';
    const retry = document.createElement('button');
    retry.type='button'; retry.className='button secondary'; retry.dataset.mapRetry=''; retry.textContent='Tentar carregar o mapa novamente';
    retry.addEventListener('click',()=>renderOfficialTerritoryMap(mapView));
    svg.after(retry);
  } finally {
    svg.setAttribute('aria-busy','false');
  }
}

function applyTerritoryMapCounts(root, items) {
  const counts = items.reduce((acc, item) => {
    item.territories.forEach(name => { acc[name] = (acc[name] || 0) + 1; });
    return acc;
  }, {});
  root.querySelectorAll('[data-territory-shape]').forEach(shape => {
    const count = counts[shape.dataset.territoryShape] || 0;
    shape.style.setProperty('--territory-intensity', String(Math.min(1, .18 + count * .13)));
    shape.classList.toggle('is-empty', count === 0);
    shape.classList.toggle('is-selected', app.querySelector('#nit-territory')?.value === shape.dataset.territoryShape);
  });
  root.querySelectorAll('[data-territory-label]').forEach(label => {
    const count = counts[label.dataset.territoryLabel] || 0;
    label.textContent = String(count);
    label.classList.toggle('is-empty', count === 0);
  });
  return counts;
}

function ensureNitMapView() {
  const catalog = app.querySelector('#nit-catalog');
  if (!catalog || app.querySelector('#nit-map-view')) return;
  const territoriesInCatalog = territoryNames;
  const mapView = document.createElement('section');
  mapView.id = 'nit-map-view';
  mapView.className = 'nit-map-view';
  mapView.hidden = true;
  mapView.innerHTML = `<div class="bahia-map-panel observatory-territory-map"><div class="bahia-map official-map-stage" aria-label="Mapa oficial dos Territórios de Identidade da Bahia"><svg id="official-territory-map" data-official-territory-map viewBox="0 0 620 680" role="group" aria-label="27 Territórios de Identidade da Bahia"><text x="310" y="330" text-anchor="middle">Carregando mapa oficial…</text></svg><div class="official-map-source">Limites territoriais: SEI Bahia · camada vetorial oficial simplificada</div></div><aside class="map-legend territory-map-sidebar"><div class="map-sidebar-head"><div><h2>Territórios de Identidade</h2></div><button id="clear-map-territory" type="button">Limpar</button></div><div class="coverage-layer-note"><b>Camada exibida</b><span>Sedes, campi e unidades das instituições.</span><b>Cobertura de atendimento do NIT</b><span>Será validada separadamente com cada núcleo.</span></div><p>Selecione um território para filtrar as instituições com presença registrada.</p><div id="nit-map-summary" class="territory-filter-list">${territoriesInCatalog.map((name,index) => `<button type="button" class="territory-filter-row" data-sidebar-territory="${name}"><i></i><span>${index + 1} · ${name}</span><b>0</b></button>`).join('')}</div><small>O município mostrado no perfil representa a sede; os demais vínculos representam presença de campi ou unidades.</small></aside></div>`;
  catalog.after(mapView);
  renderOfficialTerritoryMap(mapView);
  mapView.querySelectorAll('[data-sidebar-territory]').forEach(row => row.addEventListener('click', () => {
    const territory = app.querySelector('#nit-territory');
    if (!territory) return;
    territory.value = row.dataset.sidebarTerritory;
    territory.dispatchEvent(new Event('change'));
  }));
  mapView.querySelector('#clear-map-territory')?.addEventListener('click', () => {
    const territory = app.querySelector('#nit-territory');
    if (!territory) return;
    territory.value = '';
    territory.dispatchEvent(new Event('change'));
  });
  updateNitMap(demoNits);
}

function updateNitMap(items) {
  const mapView = app.querySelector('#nit-map-view');
  if (!mapView) return;
  mapView._visibleItems = items;
  const counts = applyTerritoryMapCounts(mapView, items);
  mapView.querySelectorAll('[data-sidebar-territory]').forEach(row => {
    const count = counts[row.dataset.sidebarTerritory] || 0;
    row.querySelector('b').textContent = count;
    row.classList.toggle('is-empty', count === 0);
    row.classList.toggle('is-selected', app.querySelector('#nit-territory')?.value === row.dataset.sidebarTerritory);
  });
}

function activateNitViews() {
  ensureNitMapView();
  const catalog = app.querySelector('#nit-catalog');
  const mapView = app.querySelector('#nit-map-view');
  const buttons = [...app.querySelectorAll('.view-button')];
  if (!catalog || !mapView || buttons.length < 2) return;
  const setMode = mode => {
    catalog.hidden = mode === 'map';
    mapView.hidden = mode !== 'map';
    buttons.forEach((button, index) => {
      const active = (index === 0 && mode === 'list') || (index === 1 && mode === 'map');
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };
  buttons[0].addEventListener('click', () => setMode('list'));
  buttons[1].addEventListener('click', () => setMode('map'));
  setMode(new URLSearchParams(location.search).get('view') === 'map' ? 'map' : 'list');
}

function applyInstitutionLogos() {
  app.querySelectorAll('.institution-logo img').forEach(image => {
    image.addEventListener('error', () => {
      image.closest('.institution-logo')?.classList.add('logo-unavailable');
    }, { once: true });
  });
}

function activateIndicatorComparisons() {
  const notes = app.querySelector('.indicator-notes');
  if (!notes || app.querySelector('#indicator-comparison')) return;
  app.querySelectorAll('.indicator-grid .content-panel').forEach(card => {
    card.insertAdjacentHTML('beforeend', '<p class="chart-source">Fonte: portfólios dos NITs e registros institucionais · Atualizado em 06/11/2026</p>');
  });
  const section = document.createElement('section');
  section.id = 'indicator-comparison';
  section.className = 'section-block comparison-panel';
  const institutionOptions = institutions.map(item => `<option value="${item.initials}">${item.initials} · ${item.name}</option>`).join('');
  section.innerHTML = `<div class="comparison-head"><div><h2>Indicadores por território e instituição</h2><p>Explore a distribuição de pesquisadores, tecnologias e ativos de propriedade intelectual.</p></div><div class="comparison-controls"><div class="comparison-switch" role="group" aria-label="Dimensão da leitura"><button type="button" class="active" data-comparison-dimension="territory">Por território</button><button type="button" data-comparison-dimension="institution">Por instituição</button></div><label>Indicador<select id="comparison-metric"><option value="researchers">Pesquisadores</option><option value="technologies">Tecnologias</option><option value="pi">Ativos de PI</option></select></label></div></div><div id="comparison-bars" class="comparison-bars"></div><section class="joint-analysis"><div class="joint-analysis-head"><div><h3>Duas instituições no mesmo painel</h3><p>Visualize capacidades complementares sem classificação ou ranking.</p></div><div class="joint-selectors"><label>Instituição A<select id="joint-institution-a">${institutionOptions}</select></label><label>Instituição B<select id="joint-institution-b">${institutionOptions}</select></label></div></div><div id="joint-institution-output"></div></section><footer>Fonte: DataNIT, sites institucionais e portfólios dos NITs · Atualizado em 06/11/2026</footer>`;
  notes.before(section);
  let dimension = 'territory';
  const metricSelect = section.querySelector('#comparison-metric');
  const renderBars = () => {
    let rows;
    if (dimension === 'territory') {
      const grouped = institutions.reduce((acc, item) => {
        item.territories.forEach(name => {
          acc[name] ||= { name, researchers: 0, technologies: 0, pi: 0 };
          acc[name].researchers += item.researchers / item.territories.length;
          acc[name].technologies += item.technologies / item.territories.length;
          acc[name].pi += item.pi / item.territories.length;
        });
        return acc;
      }, {});
      rows = Object.values(grouped);
    } else {
      rows = institutions.map(item => ({ name: item.initials, researchers: item.researchers, technologies: item.technologies, pi: item.pi }));
    }
    const metricKey = metricSelect.value;
    rows.sort((a, b) => b[metricKey] - a[metricKey]);
    const max = Math.max(...rows.map(row => row[metricKey]), 1);
    section.querySelector('#comparison-bars').innerHTML = rows.map(row => `<div class="comparison-row">${dimension === 'territory' ? `<a href="#nits/territorio/${encodeURIComponent(row.name)}">${row.name}</a>` : `<span>${row.name}</span>`}<div><i style="width:${Math.max(4, row[metricKey] / max * 100)}%"></i></div><b>${Math.round(row[metricKey]).toLocaleString('pt-BR')}</b></div>`).join('');
  };
  const jointA = section.querySelector('#joint-institution-a');
  const jointB = section.querySelector('#joint-institution-b');
  jointA.value = 'UFBA';
  jointB.value = 'UEFS';
  const renderJoint = () => {
    const first = institutions.find(item => item.initials === jointA.value) || institutions[0];
    const second = institutions.find(item => item.initials === jointB.value) || institutions[1];
    const institutionColumn = item => `<article class="joint-institution-card"><header>${institutionLogo(item.initials, 'inline')}<div><b>${item.initials}</b><span>${item.name}</span></div></header><dl><div><dt>Pesquisadores</dt><dd>${item.researchers}</dd></div><div><dt>Tecnologias</dt><dd>${item.technologies}</dd></div><div><dt>Ativos de PI</dt><dd>${item.pi}</dd></div><div><dt>Atuação territorial</dt><dd>${item.territories.length}</dd></div></dl><a href="#perfil/${demoNits.find(nit => nit.acronym === item.initials)?.id || 'uefs'}">Abrir perfil →</a></article>`;
    section.querySelector('#joint-institution-output').innerHTML = institutionColumn(first) + institutionColumn(second);
  };
  section.querySelectorAll('[data-comparison-dimension]').forEach(button => button.addEventListener('click', () => {
    dimension = button.dataset.comparisonDimension;
    section.querySelectorAll('[data-comparison-dimension]').forEach(item => item.classList.toggle('active', item === button));
    renderBars();
  }));
  metricSelect.addEventListener('change', renderBars);
  jointA.addEventListener('change', renderJoint);
  jointB.addEventListener('change', renderJoint);
  renderBars();
  renderJoint();
}

function activateNitFilters() {
  const search = app.querySelector('#nit-search');
  const territory = app.querySelector('#nit-territory');
  const nature = app.querySelector('#nit-nature');
  const status = app.querySelector('#nit-status');
  const model = app.querySelector('#nit-model');
  const catalog = app.querySelector('#nit-catalog');
  if (!search || !territory || !nature || !status || !model || !catalog) return;
  const cards = [...catalog.querySelectorAll('.entity-card')];
  const controls = [search, territory, nature, status, model];
  const count = app.querySelector('#nit-result-count');
  const empty = app.querySelector('#nit-empty');
  const reset = app.querySelector('#nit-reset');
  const chips = app.querySelector('#nit-active-filters');
  const sort = app.querySelector('#nit-sort');
  app.querySelector('.kit-filter-form')?.addEventListener('submit',event=>event.preventDefault());
  const parts = location.hash.replace('#','').split('/');
  let initialValue = '';
  try { initialValue = decodeURIComponent(parts.slice(2).join('/')); } catch { /* Ignore malformed URL values. */ }
  if (parts[1] === 'territorio') territory.value = initialValue;
  if (parts[1] === 'busca') search.value = initialValue.slice(0,120);
  const filter = () => {
    const term = normalizeTerritory(search.value);
    const visibleItems = [];
    cards.forEach((card, index) => {
      const nit = demoNits[index];
      const text = normalizeTerritory([nit.name,nit.institution,nit.municipality,nit.acronym,...nit.locations,...nit.territories].join(' '));
      const show = (!term || text.includes(term)) && (!territory.value || nit.territories.includes(territory.value)) && (!nature.value || nit.nature === nature.value) && (!status.value || nit.status === status.value) && (!model.value || nit.model === model.value);
      card.hidden = !show;
      if (show) visibleItems.push(nit);
    });
    if (sort) {
      const field = {name:'institution',city:'municipality',status:'status'}[sort.value] || 'institution';
      const sortedCards = cards.map((card,index)=>({card,item:demoNits[index]})).sort((a,b)=>a.item[field].localeCompare(b.item[field],'pt-BR') || a.item.institution.localeCompare(b.item.institution,'pt-BR'));
      sortedCards.forEach(({card})=>catalog.appendChild(card));
    }
    count.textContent = `${visibleItems.length} de ${demoNits.length} ${siteVersion === 'v1' ? 'NITs' : 'instituições e NITs'}`;
    empty.hidden = visibleItems.length !== 0;
    if (reset) reset.hidden = !controls.some(control=>control.value);
    if (chips) {
      chips.replaceChildren();
      controls.filter(control=>control.value).forEach(control=>{
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = `${control.value} ×`;
        button.setAttribute('aria-label',`Remover filtro ${control.value}`);
        button.addEventListener('click',()=>{control.value=''; filter(); control.focus();});
        chips.appendChild(button);
      });
    }
    updateNitMap(visibleItems);
  };
  const clear = () => { controls.forEach(control=>{control.value='';}); filter(); search.focus(); };
  controls.forEach(control=>control.addEventListener(control.tagName === 'INPUT' ? 'input' : 'change',filter));
  sort?.addEventListener('change',filter);
  reset?.addEventListener('click',clear);
  app.querySelector('[data-reset-nits]')?.addEventListener('click',clear);
  filter();
}

function activateTerritoryPageMap() {
  const territoryPage = app.querySelector('.official-territory-page');
  if (territoryPage) renderOfficialTerritoryMap(territoryPage);
}


function activateKitInteractions() {
  app.querySelector('#home-search-form')?.addEventListener('submit',event=>{
    event.preventDefault();
    const term=app.querySelector('#home-search').value.trim();
    location.hash=term ? `#nits/busca/${encodeURIComponent(term)}` : '#nits';
  });
  const search=app.querySelector('#institution-search');
  if(search){
    const nature=app.querySelector('#institution-nature');
    const territory=app.querySelector('#institution-territory');
    const cards=[...app.querySelectorAll('.institution-grid .institution-card')];
    const reset=app.querySelector('#institution-reset');
    const filter=()=>{
      const term=normalizeTerritory(search.value); let visible=0;
      cards.forEach((card,index)=>{const item=institutions[index];const matches=(!term||normalizeTerritory(`${item.name} ${item.initials} ${item.municipality}`).includes(term))&&(!nature.value||nature.value===item.nature)&&(!territory.value||item.territories.includes(territory.value));card.hidden=!matches;if(matches)visible++;});
      app.querySelector('#institution-result-count').textContent=`${visible} de ${institutions.length} instituições`;
      app.querySelector('#institution-empty').hidden=visible!==0;
      reset.hidden=!search.value&&!nature.value&&!territory.value;
    };
    search.addEventListener('input',filter); nature.addEventListener('change',filter); territory.addEventListener('change',filter);
    reset.addEventListener('click',()=>{search.value='';nature.value='';territory.value='';filter();search.focus();});filter();
  }

  const propertyTable=app.querySelector('.property-table');
  const technologyGrid=app.querySelector('.tech-grid');
  if(propertyTable||technologyGrid){
    const selects=[...app.querySelectorAll('.toolbar select')];
    const container=propertyTable||technologyGrid;
    const cards=[...container.querySelectorAll(propertyTable?'.table-row:not(.table-head)':'.technology-card')];
    const result=document.createElement('p');result.className='kit-record-count';result.setAttribute('role','status');result.setAttribute('aria-live','polite');container.before(result);
    const filter=()=>{let visible=0;cards.forEach((card,index)=>{
      const record=propertyTable?intellectualProperty[index]:technologies[index];
      const selected=selects.map(select=>select.selectedIndex===0?'':select.value);
      const first=propertyTable?record[1]:record.category;
      const second=propertyTable?record[4]:record.area;
      const third=propertyTable?record[5]:Number(record.stage.replace('TRL ',''));
      const thirdMatches=!selected[2]||(propertyTable?selected[2]===third:selected[2]==='TRL 4–6'?third>=4&&third<=6:third>=7&&third<=9);
      const show=(!selected[0]||selected[0]===first)&&(!selected[1]||selected[1]===second)&&thirdMatches;
      card.hidden=!show;if(show)visible++;
    });result.textContent=visible?`${visible} de ${cards.length} registros demonstrativos`:'Nenhum registro encontrado. Revise os filtros.';};
    selects.forEach(select=>select.addEventListener('change',filter));filter();
  }

  // Keep the prototype's existing researcher controls useful in both scopes.
  const researcherGrid=app.querySelector('.researcher-grid');
  if(researcherGrid){
    const input=app.querySelector('.toolbar input');
    const selects=[...app.querySelectorAll('.toolbar select')];
    const result=document.createElement('p'); result.className='kit-record-count';result.setAttribute('role','status');result.setAttribute('aria-live','polite');researcherGrid.before(result);
    const filter=()=>{let visible=0;researcherGrid.querySelectorAll('.researcher-card').forEach((card,index)=>{const item=researchers[index];const show=(!input.value||normalizeTerritory(`${item.name} ${item.area} ${item.institution}`).includes(normalizeTerritory(input.value)))&&(selects[0].selectedIndex===0||selects[0].value===item.institution)&&(selects[1].selectedIndex===0||item.nits.includes(selects[1].value));card.hidden=!show;if(show)visible++;});result.textContent=visible?`${visible} de ${researchers.length} perfis demonstrativos`:'Nenhum perfil encontrado. Revise a busca ou os filtros.';};
    input.addEventListener('input',filter);selects.forEach(select=>select.addEventListener('change',filter));filter();
  }
}

function render() {
  const route = routes[currentRoute()] ? currentRoute() : 'inicio';
  app.innerHTML = routes[route]().replace(
    'Os números deste protótipo são fictícios.',
    'Os números apresentados são fictícios.'
  );
  navLinks.forEach(link => { const active = link.dataset.routeLink === route; link.classList.toggle('active', active); if (active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current'); });
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded','false');
  document.title = `${pageNames[route]} · nit.app kit`;
  activateNitViews();
  activateProfileTabs();
  activateNitFilters();
  activateTerritoryPageMap();
  applyInstitutionLogos();
  activateIndicatorComparisons();
  activateKitInteractions();
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'auto' });
}

menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
window.addEventListener('hashchange', render);
document.querySelector('.skip-link')?.addEventListener('click',event=>{event.preventDefault();app.focus();app.scrollIntoView({block:'start'});});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&mainNav.classList.contains('open')){mainNav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.focus();}});
const accessibilityButton=document.querySelector('.accessibility');
accessibilityButton?.addEventListener('click',()=>{
  const enabled=document.body.classList.toggle('kit-large-text');
  accessibilityButton.setAttribute('aria-pressed',String(enabled));
  accessibilityButton.setAttribute('aria-label',enabled?'Restaurar tamanho do texto':'Ampliar tamanho do texto');
  document.querySelector('#accessibility-status').textContent=enabled?'Texto ampliado. Acione novamente para restaurar.':'Tamanho do texto restaurado.';
});

render();

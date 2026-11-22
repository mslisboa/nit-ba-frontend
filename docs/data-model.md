# Modelo de Dados — Frontend

## 1. Objetivo

Este documento descreve a representação das entidades do módulo de integração estadual dos NITs da Bahia no frontend.

O objetivo é estabelecer:

- Tipos utilizados na interface;
- Estruturas de dados consumidas pela API;
- Relacionamentos entre entidades;
- Modelos de filtros;
- Estruturas de indicadores;
- Regras de apresentação.

O frontend não define o modelo físico do PostgreSQL.

Os schemas oficiais das entidades são definidos pelo backend.

Este documento descreve os modelos de apresentação e consumo necessários ao frontend.

## 2. Entidades contempladas

O frontend trabalhará com:

- NIT;
- Instituição;
- Pesquisador;
- Propriedade Intelectual;
- Associação NIT–Propriedade Intelectual;
- Município;
- Território de Identidade.

A presença de instituições em municípios é representada pela associação Instituição–Município, sem uma entidade de unidade institucional (campi, endereços e estrutura interna) nesta versão do MVP.

Também utilizará estruturas auxiliares de:

- Paginação;
- Filtros;
- Indicadores;
- Tags de validação;
- Procedência dos dados.

## 3. Entidades e representações

Os exemplos abaixo representam estruturas conceituais de TypeScript.

Os nomes e tipos definitivos devem ser ajustados aos schemas reais da API.

### 3.1 NIT

Representação de um Núcleo de Inovação Tecnológica.

```typescript
interface NIT {
  id: number;
  nome: string;
  sigla?: string | null;
  site?: string | null;
  email?: string | null;
  situacao?: string | null;
  instituicao: InstitutionReference;
  propriedades_intelectuais?: PINitAssociation[];
}
```

A página de detalhes pode apresentar:

- Identificação;
- Instituição relacionada;
- Site;
- Situação;
- Propriedades intelectuais associadas, com o respectivo status de validação.

O NIT não possui município próprio no modelo atual. A localização é derivada da presença da instituição em municípios (`instituicao_municipio`), quando disponibilizada pela API.

Não inventar informações para preencher campos ausentes.

### 3.2 Instituição

Representa uma instituição/ICT.

```typescript
interface Institution {
  id: number;
  nome: string;
  sigla?: string | null;
  natureza?: string | null;
  tipo?: string | null;
  site?: string | null;
  nit?: NITReference | null;
  municipios?: InstitutionMunicipalityReference[];
}
```

Uma instituição pode existir sem NIT identificado.

A existência de uma instituição sem NIT não deve ser apresentada como erro.

A presença da instituição em municípios não determina automaticamente a localização de suas PIs nem o vínculo com o NIT.

A página de detalhes poderá apresentar:

- Informações gerais;
- NIT relacionado;
- Presença em municípios;
- Pesquisadores;
- Propriedade intelectual;
- Distribuição territorial.

### 3.3 Pesquisador

```typescript
interface Researcher {
  id: number;
  nome: string;
  id_simcc?: string | null;
  id_lattes?: string | null;
  orcid?: string | null;
  instituicoes?: ResearcherInstitutionReference[];
}
```

Um pesquisador pode possuir múltiplos vínculos institucionais.

A interface deverá representar esses vínculos sem duplicar o pesquisador.

A página de detalhes poderá apresentar:

- Nome;
- Identificadores disponíveis (`id_simcc`, `id_lattes`, `orcid`);
- Instituições relacionadas;
- Propriedade intelectual associada.

### 3.4 Propriedade Intelectual

```typescript
interface IntellectualProperty {
  id: number;
  identificador_badepi?: string | null;
  titulo?: string | null;
  tipo_pi: string;
  numero_processo?: string | null;
  data_deposito?: string | null;
  data_publicacao?: string | null;
  situacao?: string | null;
  data_atualizacao_fonte?: string | null;
  instituicoes?: PIInstitutionReference[];
  pesquisadores?: PIResearcherReference[];
  nits?: PINitAssociation[];
}
```

A interface deve diferenciar:

- Patentes;
- Programas de computador;
- Marcas;
- Desenhos industriais;
- Indicações geográficas;
- Outras modalidades disponíveis.

A classificação deve seguir os dados retornados pela API.

Não criar categorias que não existam no contrato.

A PI não possui `id_nit` nem um status de validação próprio. A relação com o NIT e o respectivo status são registrados na associação NIT–PI. Assim, a mesma PI pode ter situações diferentes para NITs diferentes.

A página de detalhes poderá apresentar:

- Título;
- Modalidade;
- Número de processo;
- Datas;
- Situação;
- Identificador BADEPI e data de atualização da fonte;
- Instituições participantes;
- Pesquisadores relacionados;
- NITs associados e tags de validação.

### 3.5 Município

```typescript
interface Municipality {
  id: number;
  codigo_ibge: string;
  nome: string;
  territorio?: TerritoryReference | null;
}
```

O código IBGE poderá ser utilizado para identificar o município em filtros e consultas.

### 3.6 Território de Identidade

```typescript
interface Territory {
  id: number;
  codigo?: string | null;
  nome: string;
  municipios?: MunicipalityReference[];
}
```

A página de território poderá apresentar:

- Nome;
- Municípios;
- Instituições relacionadas;
- NITs presentes;
- Pesquisadores relacionados;
- Indicadores de PI.

A quantidade de registros deve ser obtida da API, respeitando os critérios de agregação definidos pelo backend.

### 3.7 Associação NIT–Propriedade Intelectual

Representa uma associação candidata ou validada entre um NIT e uma propriedade intelectual.

```typescript
type StatusValidacao =
  | "PENDENTE"
  | "CONFIRMADA"
  | "NAO_CONFIRMADA"
  | "INCONCLUSIVA";

type MetodoIdentificacao =
  | "VINCULO_PESQUISADOR"
  | "NOME_INVENTOR";

type MetodoValidacao =
  | "RELATORIO_NIT"
  | "VALIDACAO_MANUAL";

interface PINitAssociation {
  nit: NITReference;
  propriedade_intelectual: IntellectualPropertyReference;
  status_validacao: StatusValidacao;
  metodo_identificacao: MetodoIdentificacao;
  metodo_validacao?: MetodoValidacao | null;
  data_identificacao: string;
  data_validacao?: string | null;
  referencia_evidencia?: string | null;
  observacao?: string | null;
}
```

A associação é a única fonte de verdade para indicar que uma PI passou por um NIT.

A associação é criada automaticamente como `PENDENTE`. Apenas a validação no backend pode alterá-la para `CONFIRMADA`, `NAO_CONFIRMADA` ou `INCONCLUSIVA`.

A interface deve consumir os endpoints de associação disponibilizados pelo backend:

- `GET /api/v1/nits/{id}/propriedades-intelectuais`;
- `GET /api/v1/propriedades-intelectuais/{id}/nits`.

A operação de validação será definida pelo backend em fase posterior. O frontend não deve implementar a transição de status nem reproduzir as regras de validação.

## 4. Estruturas de referência

Utilizar representações simplificadas para relacionamentos quando a API não exigir a entidade completa.

### 4.1 InstitutionReference

```typescript
interface InstitutionReference {
  id: number;
  nome: string;
  sigla?: string | null;
}
```

### 4.2 NITReference

```typescript
interface NITReference {
  id: number;
  nome: string;
  sigla?: string | null;
}
```

### 4.3 MunicipalityReference

```typescript
interface MunicipalityReference {
  id: number;
  codigo_ibge?: string;
  nome: string;
}
```

### 4.4 TerritoryReference

```typescript
interface TerritoryReference {
  id: number;
  nome: string;
}
```

### 4.5 InstitutionMunicipalityReference

```typescript
interface InstitutionMunicipalityReference {
  municipio: MunicipalityReference;
  tipo_localizacao?: "SEDE" | "CAMPUS" | "UNIDADE" | string | null;
}
```

A presença em município deve ser apresentada como informação complementar, não como localização automática de todas as PIs ou do NIT.

### 4.6 ResearcherInstitutionReference

```typescript
interface ResearcherInstitutionReference {
  instituicao: InstitutionReference;
  tipo_vinculo?: string | null;
  data_inicio?: string | null;
  data_fim?: string | null;
}
```

As datas são opcionais e, quando disponíveis, podem apoiar a leitura sobre o período do vínculo. O frontend não deve usá-las para validar automaticamente associações NIT–PI.

### 4.7 PIInstitutionReference

```typescript
interface PIInstitutionReference {
  instituicao: InstitutionReference;
  papel: string;
}
```

### 4.8 PIResearcherReference

```typescript
interface PIResearcherReference {
  pesquisador?: ResearcherReference | null;
  nome_inventor: string;
  papel?: string | null;
  ordem?: number | null;
}
```

O inventor informado pela BADEPI pode não estar identificado no cadastro de pesquisadores. Nesse caso, `pesquisador` é nulo e o nome original deve ser preservado em `nome_inventor`.

### 4.9 ResearcherReference

```typescript
interface ResearcherReference {
  id: number;
  nome: string;
}
```

### 4.10 IntellectualPropertyReference

```typescript
interface IntellectualPropertyReference {
  id: number;
  titulo?: string | null;
  tipo_pi: string;
  numero_processo?: string | null;
}
```

Essas referências são exemplos para o frontend.

A estrutura efetiva deverá corresponder aos schemas reais disponibilizados pelo backend.

## 5. Relacionamentos utilizados pela interface

### NIT e Instituição

A relação é 1:1.

Cada NIT possui uma instituição relacionada.

Cada instituição possui no máximo um NIT.

Uma instituição sem NIT identificado pode existir.

A interface deve permitir navegação em ambos os sentidos.

### Instituição e Pesquisador

Relacionamento N:N.

Um pesquisador pode estar relacionado a várias instituições.

Uma instituição pode possuir vários pesquisadores.

Não duplicar pesquisadores por possuírem múltiplos vínculos.

### Instituição e Propriedade Intelectual

Relacionamento N:N.

Uma propriedade intelectual pode envolver diferentes instituições.

A interface deve diferenciar os papéis das instituições.

Essa relação não confirma a participação do NIT da instituição na PI.

### Pesquisador e Propriedade Intelectual

Relacionamento N:N.

Uma PI pode possuir múltiplos inventores ou autores.

A interface deve preservar os papéis de cada participante.

Inventores não identificados como pesquisadores devem continuar sendo apresentados com o nome informado pela fonte.

### NIT e Propriedade Intelectual

Relacionamento N:N por meio de `nit_propriedade_intelectual`.

Cada associação possui um status de validação próprio.

A interface somente deve apresentar uma PI como validada para um NIT quando o status da associação correspondente for `CONFIRMADA`.

Não assumir que toda PI pertencente a uma instituição foi gerenciada pelo NIT correspondente.

### Instituição e Município

Relacionamento N:N por meio de `instituicao_municipio`.

Uma instituição pode estar presente em vários municípios.

Um município pode abrigar várias instituições.

A presença em município não determina automaticamente a localização das PIs nem o vínculo com o NIT.

### Município e Território

Relacionamento 1:N.

Um território possui vários municípios.

Cada município deve ser apresentado com seu território correspondente, quando essa informação estiver disponível.

## 6. Estruturas de consulta

### 6.1 Paginação

As listagens devem utilizar estruturas de paginação definidas pelo backend.

Exemplo conceitual:

```typescript
interface Pagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
```

O formato definitivo deve seguir o contrato da API.

### 6.2 Resposta de consulta individual

```typescript
interface ApiResponse<T> {
  data: T;
}
```

Utilizar o formato efetivamente adotado pelo backend.

Não criar envelopes artificiais quando a API retornar o objeto diretamente.

### 6.3 Filtros de NIT

```typescript
interface NITFilters {
  search?: string;
  instituicao_id?: number;
  territorio_id?: number;
  situacao?: string;
  status_validacao?: StatusValidacao;
  page?: number;
  page_size?: number;
}
```

O filtro `status_validacao` deve considerar as associações NIT–PI, quando disponibilizado pela API.

### 6.4 Filtros de Instituição

```typescript
interface InstitutionFilters {
  search?: string;
  nit_id?: number;
  municipio_id?: number;
  territorio_id?: number;
  natureza?: string;
  tipo?: string;
  page?: number;
  page_size?: number;
}
```

### 6.5 Filtros de Pesquisador

```typescript
interface ResearcherFilters {
  search?: string;
  instituicao_id?: number;
  page?: number;
  page_size?: number;
}
```

### 6.6 Filtros de Propriedade Intelectual

```typescript
interface IntellectualPropertyFilters {
  search?: string;
  tipo_pi?: string;
  instituicao_id?: number;
  pesquisador_id?: number;
  nit_id?: number;
  status_validacao?: StatusValidacao;
  situacao?: string;
  ano_deposito?: number;
  page?: number;
  page_size?: number;
}
```

O filtro por `status_validacao` deve ser aplicado sobre a associação NIT–PI, e não sobre um status próprio da PI.

### 6.7 Filtros de associação NIT–PI

```typescript
interface NITPIAssociationFilters {
  nit_id?: number;
  propriedade_intelectual_id?: number;
  status_validacao?: StatusValidacao;
  metodo_identificacao?: MetodoIdentificacao;
  metodo_validacao?: MetodoValidacao;
  page?: number;
  page_size?: number;
}
```

### 6.8 Filtros territoriais

```typescript
interface TerritoryFilters {
  search?: string;
  page?: number;
  page_size?: number;
}
```

Os parâmetros apresentados são sugestões de organização.

A implementação deve respeitar os filtros realmente disponíveis na API.

## 7. Indicadores

O frontend deverá utilizar os indicadores retornados pelo backend.

Categorias principais:

- Quantidade de NITs;
- Quantidade de instituições;
- Quantidade de pesquisadores;
- Quantidade de registros de PI;
- Distribuição por modalidade;
- Distribuição por território;
- Distribuição por município;
- Distribuição das associações NIT–PI por status de validação.

Não implementar agregações complexas de grandes volumes de registros no navegador.

O backend deve ser responsável por cálculos e agregações que envolvam grandes conjuntos de dados.

Indicadores de PI validada somente devem considerar associações com `status_validacao = CONFIRMADA`.

### 7.1 Procedência dos indicadores

Sempre que aplicável, apresentar:

- Fonte;
- Período de referência;
- Data de atualização;
- Critério de cálculo.

Não apresentar indicadores sem contexto temporal quando a informação depender de um período.

## 8. Procedência e atualização

Quando disponibilizados pela API, os registros poderão apresentar os campos de procedência preservados no modelo:

```typescript
interface DataProvenance {
  identificador_badepi?: string | null;
  data_atualizacao_fonte?: string | null;
  referencia_evidencia?: string | null;
}
```

- `identificador_badepi` e `data_atualizacao_fonte` estão relacionados aos registros de PI;
- `referencia_evidencia` está relacionada à validação de uma associação NIT–PI (por exemplo, relatório, página, planilha ou linha).

As tabelas de fonte e lote de importação não fazem parte desta versão simplificada do modelo. O frontend não deve presumir a disponibilidade de `fonte`, `periodo_referencia`, `data_extracao` ou `data_atualizacao` quando esses campos não estiverem no contrato da API.

A interface deve apresentar essas informações de maneira compreensível.

Não presumir uma data de atualização quando ela não estiver disponível.

## 9. Validação NIT–PI e tags de classificação

As PIs validadas são classificadas na interface por tags derivadas de `status_validacao` da associação NIT–PI.

As tags são uma representação visual. Elas não criam novos estados e não substituem o contrato da API.

### 9.1 Tags por status

| `status_validacao` | Tag sugerida | Semântica | Tom visual sugerido |
|---|---|---|---|
| `PENDENTE` | Pendente | Associação identificada automaticamente, ainda não validada. | Neutro |
| `CONFIRMADA` | Confirmada | Há evidência de que a PI passou pelo NIT. | Sucesso |
| `NAO_CONFIRMADA` | Não confirmada | Há evidência de que a PI não corresponde à atuação do NIT. | Alerta/erro |
| `INCONCLUSIVA` | Inconclusiva | As informações disponíveis não permitem conclusão. | Atenção |

```typescript
interface ValidationTag {
  status: StatusValidacao;
  label: string;
  tone: "neutral" | "success" | "danger" | "warning";
  nit?: NITReference | null;
  data_validacao?: string | null;
  referencia_evidencia?: string | null;
}
```

### 9.2 Regras de apresentação das tags

- A tag deve ser exibida a partir da associação NIT–PI, identificando o NIT correspondente quando a listagem envolver mais de um NIT.
- Uma PI com múltiplas associações pode apresentar múltiplas tags, uma para cada NIT.
- Não exibir a tag "Confirmada" para associações `PENDENTE` ou `INCONCLUSIVA`.
- "PI validada" significa `status_validacao = CONFIRMADA`; os demais estados não devem ser apresentados como validação positiva.
- `PENDENTE` não deve ser apresentada como vínculo confirmado.
- `NAO_CONFIRMADA` não deve ser omitida; ela representa uma conclusão de validação, não ausência de dados.
- A ausência de associação não deve ser convertida automaticamente em `NAO_CONFIRMADA`; são situações distintas.
- As tags não devem ser produzidas por regras de negócio no frontend. A correspondência entre `status_validacao` e rótulo/tom visual pode ser feita em um adaptador de apresentação.
- Quando houver `referencia_evidencia` e `data_validacao`, elas poderão ser exibidas em detalhe ou tooltip da tag.
- O frontend não deve permitir alterar o status da associação enquanto o endpoint de validação não estiver definido pelo backend.

### 9.3 Locais de exibição

As tags poderão ser utilizadas em:

- Listagem de propriedades intelectuais;
- Página de detalhes da PI;
- Página de detalhes do NIT;
- Resultados de busca e filtros;
- Indicadores de PI validada.

## 10. Estados de apresentação

As consultas devem tratar:

- Loading;
- Success;
- Empty;
- Error.

### Loading

Apresentar feedback de carregamento.

### Success

Apresentar os dados retornados.

### Empty

Informar que não existem resultados para os filtros utilizados.

### Error

Apresentar mensagem compreensível e permitir nova tentativa quando apropriado.

Ausência de dados não deve ser representada como quantidade zero automaticamente.

## 11. Regras de tipagem

- Utilizar tipos consistentes.
- Evitar o uso indiscriminado de any.
- Representar dados opcionais com tipos apropriados.
- Diferenciar campos obrigatórios e nulos.
- Centralizar tipos compartilhados.
- Evitar duplicação de interfaces.
- Priorizar tipos derivados dos contratos OpenAPI quando viável.
- Reutilizar os tipos `StatusValidacao`, `MetodoIdentificacao` e `MetodoValidacao` em filtros, tags e associações.

Os modelos de apresentação podem ser diferentes dos schemas originais da API, desde que a conversão seja explícita e documentada.

## 12. Separação entre API e apresentação

Não utilizar diretamente respostas brutas da API em todos os componentes.

Implementar uma camada de serviços e, quando necessário, adaptadores responsáveis por transformar respostas em modelos apropriados à interface.

Não duplicar regras de negócio.

Não realizar correspondências de entidades no frontend.

Não implementar cálculos que devam pertencer ao backend.

Não implementar a validação NIT–PI no frontend. O frontend apenas apresenta o status retornado pela API.

## 13. Limitações conhecidas

A estrutura final dos tipos depende da disponibilidade real dos campos provenientes de:

- DATANIT;
- Relatórios dos NITs;
- Fontes institucionais;
- Observatório/SIMCC;
- BADEPI.

A cobertura das associações NIT–PI depende da correspondência entre inventores e pesquisadores e da disponibilidade de evidências nos relatórios dos NITs.

Campos ainda não confirmados devem permanecer documentados como pendentes.

Não implementar interfaces que presumam a disponibilidade de informações ainda não confirmadas.

## 14. Evolução

Este documento representa o modelo de apresentação do MVP.

Novos atributos e entidades poderão ser incorporados futuramente.

Toda mudança deverá considerar:

1. Alterações no modelo canônico;
2. Alterações na API;
3. Impactos nos serviços;
4. Impactos nos componentes;
5. Atualização dos tipos;
6. Atualização dos testes.

O frontend não deve modificar unilateralmente o contrato da API.

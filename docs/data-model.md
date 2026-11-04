
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
- Unidade Institucional;
- Pesquisador;
- Propriedade Intelectual;
- Município;
- Território de Identidade.

Também utilizará estruturas auxiliares de:

- Paginação;
- Filtros;
- Indicadores;
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
  descricao?: string | null;
  site?: string | null;
  email?: string | null;
  situacao?: string | null;
  instituicao: InstitutionReference;
  municipio?: MunicipalityReference | null;
  data_atualizacao?: string | null;
}
```

A página de detalhes pode apresentar:

- Identificação;
- Descrição;
- Instituição relacionada;
- Município;
- Site;
- Situação;
- Dados de propriedade intelectual relacionados, quando disponíveis.

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
  descricao?: string | null;
  nit?: NITReference | null;
  municipio_sede?: MunicipalityReference | null;
  unidades?: InstitutionalUnitReference[];
}
```

Uma instituição pode existir sem NIT identificado.

A existência de uma instituição sem NIT não deve ser apresentada como erro.

A página de detalhes poderá apresentar:

- Informações gerais;
- NIT relacionado;
- Unidades institucionais;
- Pesquisadores;
- Propriedade intelectual;
- Distribuição territorial.

### 3.3 Unidade Institucional

```typescript
interface InstitutionalUnit {
  id: number;
  nome: string;
  tipo?: string | null;
  endereco?: string | null;
  municipio?: MunicipalityReference | null;
}
```

Unidades devem ser apresentadas quando a API disponibilizar essas informações.

Não presumir que todas as instituições possuam campi cadastrados.

### 3.4 Pesquisador

```typescript
interface Researcher {
  id: number;
  nome: string;
  id_lattes?: string | null;
  orcid?: string | null;
  area_atuacao?: string | null;
  instituicoes?: ResearcherInstitutionReference[];
}
```

Um pesquisador pode possuir múltiplos vínculos institucionais.

A interface deverá representar esses vínculos sem duplicar o pesquisador.

A página de detalhes poderá apresentar:

- Nome;
- Área de atuação;
- Identificadores disponíveis;
- Instituições relacionadas;
- Propriedade intelectual associada.

### 3.5 Propriedade Intelectual

```typescript
interface IntellectualProperty {
  id: number;
  titulo?: string | null;
  tipo_pi: string;
  numero_processo?: string | null;
  data_deposito?: string | null;
  data_publicacao?: string | null;
  situacao?: string | null;
  descricao?: string | null;
  instituicoes?: PIInstitutionReference[];
  pesquisadores?: PIResearcherReference[];
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

A página de detalhes poderá apresentar:

- Título;
- Modalidade;
- Número de processo;
- Datas;
- Situação;
- Instituições participantes;
- Pesquisadores relacionados.

### 3.6 Município

```typescript
interface Municipality {
  id: number;
  codigo_ibge: string;
  nome: string;
  uf: string;
  territorio?: TerritoryReference | null;
}
```

O código IBGE poderá ser utilizado para identificar o município em filtros e consultas.

### 3.7 Território de Identidade

```typescript
interface Territory {
  id: number;
  codigo?: string | null;
  nome: string;
  descricao?: string | null;
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

### 4.5 ResearcherInstitutionReference

```typescript
interface ResearcherInstitutionReference {
  instituicao: InstitutionReference;
  unidade?: InstitutionalUnitReference | null;
  tipo_vinculo?: string | null;
  vinculo_principal?: boolean | null;
}
```

### 4.6 InstitutionalUnitReference

```typescript
interface InstitutionalUnitReference {
  id: number;
  nome: string;
  municipio?: MunicipalityReference | null;
}
```

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
  pesquisador: ResearcherReference;
  papel: string;
}
```

### 4.9 ResearcherReference

```typescript
interface ResearcherReference {
  id: number;
  nome: string;
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

### Pesquisador e Propriedade Intelectual

Relacionamento N:N.

Uma PI pode possuir múltiplos inventores ou autores.

A interface deve preservar os papéis de cada participante.

### NIT e Propriedade Intelectual

Relacionamento opcional.

Somente apresentar relação direta quando a API disponibilizar evidência desse vínculo.

Não assumir que toda PI pertencente a uma instituição foi gerenciada pelo NIT correspondente.

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
  municipio_id?: number;
  territorio_id?: number;
  situacao?: string;
  page?: number;
  page_size?: number;
}
```

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
  area_atuacao?: string;
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
  municipio_id?: number;
  territorio_id?: number;
  situacao?: string;
  ano_deposito?: number;
  page?: number;
  page_size?: number;
}
```

### 6.7 Filtros territoriais

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
- Distribuição por município.

Não implementar agregações complexas de grandes volumes de registros no navegador.

O backend deve ser responsável por cálculos e agregações que envolvam grandes conjuntos de dados.

### 7.1 Procedência dos indicadores

Sempre que aplicável, apresentar:

- Fonte;
- Período de referência;
- Data de atualização;
- Critério de cálculo.

Não apresentar indicadores sem contexto temporal quando a informação depender de um período.

## 8. Procedência e atualização

Quando disponibilizados pela API, os registros poderão apresentar:

```typescript
interface DataProvenance {
  fonte?: string | null;
  periodo_referencia?: string | null;
  data_extracao?: string | null;
  data_atualizacao?: string | null;
}
```

A interface deve apresentar essas informações de maneira compreensível.

Não presumir uma data de atualização quando ela não estiver disponível.

## 9. Estados de apresentação

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

## 10. Regras de tipagem

- Utilizar tipos consistentes.
- Evitar o uso indiscriminado de any.
- Representar dados opcionais com tipos apropriados.
- Diferenciar campos obrigatórios e nulos.
- Centralizar tipos compartilhados.
- Evitar duplicação de interfaces.
- Priorizar tipos derivados dos contratos OpenAPI quando viável.

Os modelos de apresentação podem ser diferentes dos schemas originais da API, desde que a conversão seja explícita e documentada.

## 11. Separação entre API e apresentação

Não utilizar diretamente respostas brutas da API em todos os componentes.

Implementar uma camada de serviços e, quando necessário, adaptadores responsáveis por transformar respostas em modelos apropriados à interface.

Não duplicar regras de negócio.

Não realizar correspondências de entidades no frontend.

Não implementar cálculos que devam pertencer ao backend.

## 12. Limitações conhecidas

A estrutura final dos tipos depende da disponibilidade real dos campos provenientes de:

- DATANIT;
- Relatórios dos NITs;
- Fontes institucionais;
- Observatório/SIMCC;
- BADEPI.

Campos ainda não confirmados devem permanecer documentados como pendentes.

Não implementar interfaces que presumam a disponibilidade de informações ainda não confirmadas.

## 13. Evolução

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

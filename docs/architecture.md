
# Arquitetura do Frontend

## 1. Visão geral

Este repositório contém a aplicação frontend do módulo de integração estadual dos NITs da Bahia, integrado ao Observatório de Ciência, Tecnologia e Inovação (CT&I) da Bahia.

O frontend será responsável por apresentar e permitir a exploração das informações integradas pelo sistema.

A aplicação será desenvolvida utilizando Next.js.

O frontend consumirá os dados exclusivamente através da API REST disponibilizada pelo backend FastAPI.

O projeto possui repositórios independentes para frontend, backend, ETL e infraestrutura.

## 2. Responsabilidades

O frontend é responsável por:

1. Apresentar os dados disponibilizados pelo backend.
2. Disponibilizar navegação entre as entidades.
3. Permitir pesquisas e filtros.
4. Apresentar indicadores.
5. Apresentar informações territoriais.
6. Disponibilizar páginas de consulta e detalhes.
7. Gerenciar estados de carregamento, erro e ausência de dados.
8. Garantir uma interface responsiva e acessível.
9. Manter compatibilidade visual com o Observatório de CT&I da Bahia.

O frontend NÃO é responsável por:

- Consultar diretamente o PostgreSQL;
- Executar processos de ETL;
- Extrair dados de fontes externas;
- Implementar regras de integração entre fontes;
- Realizar correspondências entre pesquisadores e instituições;
- Definir a estrutura física do banco;
- Implementar regras de negócio pertencentes ao backend.

## 3. Tecnologias

Tecnologia principal:

- Next.js.

Tecnologias complementares devem seguir as escolhas já adotadas pelo Observatório e pelo repositório existente.

Antes de adicionar bibliotecas, verificar:

- Versão do Next.js;
- React;
- TypeScript, caso utilizado;
- Gerenciador de pacotes;
- Biblioteca de componentes;
- Biblioteca de gráficos;
- Biblioteca de mapas;
- Estratégia de estilização;
- Ferramentas de testes.

Não adicionar dependências desnecessárias.

Não alterar versões de dependências sem necessidade técnica.

## 4. Arquitetura geral

O fluxo de comunicação é:

Fontes externas
    |
    v
ETL (Python)
    |
    v
PostgreSQL
    |
    v
Backend (FastAPI)
    |
    v
API REST / JSON
    |
    v
Frontend (Next.js)
    |
    v
Usuário

O frontend deve consumir exclusivamente a API.

Não estabelecer conexões diretas com o banco de dados.

Não acessar diretamente fontes externas para substituir funcionalidades do backend.

## 5. Organização interna

Estrutura de referência:

frontend/
|
├── src/
│   ├── app/
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── ui/
│   │   ├── charts/
│   │   ├── maps/
│   │   └── tables/
│   │
│   ├── features/
│   │   ├── dashboard/
│   │   ├── nits/
│   │   ├── instituicoes/
│   │   ├── pesquisadores/
│   │   ├── propriedade-intelectual/
│   │   └── territorios/
│   │
│   ├── services/
│   │   ├── api/
│   │   └── endpoints/
│   │
│   ├── hooks/
│   │
│   ├── types/
│   │
│   ├── lib/
│   │
│   └── utils/
│
├── public/
│
├── docs/
│
├── tests/
│
├── Dockerfile
├── .dockerignore
├── .env.example
├── package.json
└── README.md

Esta estrutura é uma referência inicial.

Antes de implementar, inspecionar a estrutura existente e verificar os padrões do Observatório.

Não reorganizar o projeto desnecessariamente.

## 6. Organização por funcionalidades

Sempre que adequado, organizar as funcionalidades em módulos independentes.

### 6.1 Dashboard

Responsável pela visão geral do ecossistema de inovação.

Deve apresentar:

- Quantidade de NITs;
- Quantidade de instituições;
- Quantidade de pesquisadores;
- Quantidade de registros de PI;
- Distribuição territorial;
- Indicadores gerais disponíveis.

Os indicadores devem ser obtidos do backend.

Não calcular indicadores complexos utilizando grandes conjuntos de dados no navegador quando a agregação puder ser realizada pela API.

### 6.2 NITs

Responsável pela consulta dos NITs da Bahia.

Funcionalidades:

- Listagem;
- Pesquisa textual;
- Filtros;
- Paginação;
- Página de detalhes;
- Navegação para a instituição relacionada.

A página de detalhes deve apresentar somente informações disponíveis na API.

### 6.3 Instituições/ICTs

Responsável pela consulta das instituições.

Funcionalidades:

- Listagem;
- Pesquisa;
- Filtros;
- Página de detalhes;
- NIT relacionado;
- Unidades institucionais, quando disponíveis;
- Pesquisadores relacionados;
- Propriedade intelectual relacionada;
- Localização territorial.

### 6.4 Pesquisadores

Responsável pela consulta de pesquisadores.

Funcionalidades:

- Listagem;
- Pesquisa;
- Filtros;
- Página de detalhes;
- Instituições relacionadas;
- Áreas de atuação;
- Propriedade intelectual associada, quando disponível.

Não apresentar relacionamentos que não tenham sido confirmados pelo backend.

### 6.5 Propriedade Intelectual

Responsável pela consulta de registros de PI.

Funcionalidades:

- Listagem;
- Pesquisa;
- Filtros por modalidade;
- Filtros por instituição;
- Filtros por pesquisador;
- Filtros por período;
- Página de detalhes;
- Identificação de titulares, depositantes, inventores e autores, quando disponíveis.

Não duplicar registros na interface para representar múltiplos participantes.

### 6.6 Territórios de Identidade

Responsável pela exploração territorial dos dados.

Funcionalidades:

- Listagem dos Territórios de Identidade;
- Consulta de detalhes;
- Visualização de municípios;
- Filtros territoriais;
- Indicadores por território;
- Distribuição territorial dos NITs;
- Distribuição territorial das instituições;
- Indicadores de pesquisadores;
- Indicadores de propriedade intelectual.

As informações territoriais devem respeitar os critérios de atribuição definidos pelo backend.

## 7. Navegação

A navegação deve refletir as dimensões do MVP.

Estrutura sugerida:

- Visão geral;
- NITs;
- Instituições;
- Pesquisadores;
- Propriedade Intelectual;
- Territórios de Identidade.

A organização definitiva da navegação deverá considerar a identidade visual e os padrões existentes no Observatório.

Permitir navegar entre entidades relacionadas.

Exemplos:

NIT -> Instituição

Instituição -> NIT

Instituição -> Pesquisadores

Instituição -> Propriedade Intelectual

Pesquisador -> Instituições

Pesquisador -> Propriedade Intelectual

Território -> Municípios -> Instituições

## 8. Integração com a API

A comunicação com o backend deve ser centralizada em uma camada de serviços.

Evitar chamadas HTTP espalhadas diretamente pelos componentes.

A camada de serviços deve concentrar:

- Configuração da URL base;
- Headers;
- Parâmetros;
- Serialização;
- Tratamento de erros;
- Tipagem das respostas.

A URL base da API deve ser configurável por variável de ambiente.

Exemplo conceitual:

NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

Não armazenar credenciais ou segredos em variáveis NEXT_PUBLIC_.

### 8.1 Contratos

Utilizar os contratos disponibilizados pelo backend.

O backend é responsável pela documentação OpenAPI.

O frontend deve respeitar:

- Nomes de campos;
- Tipos;
- Estrutura de respostas;
- Parâmetros;
- Paginação;
- Filtros;
- Códigos de erro.

Não criar estruturas fictícias para substituir respostas da API.

### 8.2 Tipagem

Utilizar tipagem consistente para as entidades e respostas da API.

Quando possível, considerar a geração de tipos TypeScript a partir da especificação OpenAPI.

Não manter interfaces duplicadas e inconsistentes.

## 9. Gerenciamento de estados

A interface deve representar adequadamente:

### Carregamento

Informar ao usuário que os dados estão sendo carregados.

### Sucesso

Apresentar os resultados retornados pela API.

### Ausência de dados

Informar quando não existirem registros para determinada consulta.

Não interpretar ausência de dados como zero automaticamente.

### Erro

Apresentar mensagens compreensíveis e evitar expor detalhes internos.

### Filtros

Manter os parâmetros de consulta consistentes com a API.

Sempre que adequado, permitir que filtros sejam representados na URL.

Evitar requisições desnecessárias.

## 10. Visualização de dados

Utilizar gráficos e visualizações para facilitar a exploração das informações.

Possibilidades:

- Gráficos de distribuição;
- Indicadores numéricos;
- Séries temporais;
- Comparações por modalidade de PI;
- Distribuição territorial;
- Tabelas filtráveis;
- Mapas temáticos.

As visualizações devem utilizar dados provenientes da API.

Não inventar valores.

Indicadores devem informar períodos e critérios relevantes.

Quando houver possibilidade de múltiplas associações territoriais, respeitar as regras de agregação retornadas pelo backend.

## 11. Identidade visual e UX

O frontend deve manter compatibilidade com a identidade visual do Observatório de CT&I da Bahia.

Antes de criar componentes visuais:

1. Inspecionar o frontend do Observatório.
2. Identificar padrões de layout.
3. Identificar cores e tipografia.
4. Verificar componentes reutilizáveis.
5. Avaliar responsividade.
6. Reaproveitar padrões adequados.

Priorizar:

- Clareza;
- Simplicidade;
- Consistência;
- Responsividade;
- Acessibilidade;
- Navegação intuitiva.

Não criar uma identidade visual independente sem necessidade ou autorização.

## 12. Responsividade e acessibilidade

A interface deve funcionar em:

- Desktop;
- Tablet;
- Dispositivos móveis.

Considerar:

- Navegação por teclado;
- Contraste;
- Rótulos;
- Textos alternativos;
- Tabelas acessíveis;
- Estados de foco;
- Hierarquia visual.

Gráficos e mapas devem possuir alternativas textuais quando necessário.

## 13. Docker

O frontend deve possuir Dockerfile próprio.

A execução integrada é controlada pelo repositório nit-ba-infra.

O container deve:

- Executar a aplicação Next.js;
- Utilizar a porta configurada;
- Utilizar variáveis de ambiente;
- Não armazenar dados persistentes;
- Utilizar dependências controladas;
- Possuir configuração adequada para desenvolvimento e produção.

Não criar um Docker Compose concorrente para toda a aplicação.

## 14. Segurança

- Não armazenar segredos no frontend.
- Não incluir credenciais em variáveis públicas.
- Não acessar o banco diretamente.
- Não contornar mecanismos de autenticação existentes no Observatório.
- Validar parâmetros de navegação.
- Não expor informações pessoais desnecessárias.
- Tratar erros da API sem apresentar informações internas.

## 15. Testes

Implementar testes adequados para:

- Componentes;
- Páginas;
- Navegação;
- Serviços de API;
- Filtros;
- Estados de carregamento;
- Estados de erro;
- Renderização de dados;
- Responsividade.

Testar a integração com a API utilizando respostas controladas.

Não depender exclusivamente de dados fictícios para considerar uma funcionalidade concluída.

## 16. Desenvolvimento

Antes de implementar:

1. Inspecionar o repositório.
2. Identificar versão do Next.js.
3. Identificar App Router ou Pages Router.
4. Verificar o uso de TypeScript.
5. Identificar gerenciador de pacotes.
6. Inspecionar os padrões visuais do Observatório.
7. Verificar a API disponível.
8. Consultar os documentos complementares relevantes.

Não presumir uma configuração de frontend antes de inspecionar o projeto.

## 17. Critérios de conclusão do MVP

O frontend deverá permitir:

- Visualizar o panorama geral;
- Consultar NITs;
- Consultar instituições;
- Consultar pesquisadores;
- Consultar propriedade intelectual;
- Consultar Territórios de Identidade;
- Utilizar filtros;
- Navegar entre entidades relacionadas;
- Visualizar indicadores;
- Consultar informações territoriais;
- Identificar origem e período dos dados;
- Consumir a API FastAPI;
- Executar em container Docker.

## 18. Princípio fundamental

O frontend deve funcionar como uma camada de exploração e visualização dos dados integrados.

Sua responsabilidade é apresentar informações confiáveis, de maneira clara e consistente.

Não implementar regras de integração ou manipulação de dados que pertençam ao ETL ou ao backend.

Não implementar funcionalidades fora do escopo do MVP sem autorização.

# nit-ba-frontend

Frontend do módulo de integração estadual dos NITs da Bahia, integrado ao
Observatório de CT&I da Bahia. Aplicação Next.js responsável por apresentar e
permitir a exploração das informações integradas pelo sistema: NITs,
instituições/ICTs, pesquisadores, propriedade intelectual e Territórios de
Identidade.

## Requisitos

- Node.js LTS (versão mínima 20)
- npm

## Desenvolvimento

```bash
npm install
cp .env.example .env.local
# configure NEXT_PUBLIC_API_URL apontando para a API do backend
npm run dev
```

A aplicação fica disponível em [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL base da API FastAPI do backend (ex.: `http://localhost:8000/api/v1`) |

- Copie `.env.example` para `.env.local` e ajuste conforme o ambiente.
- **Importante:** no Next.js, variáveis `NEXT_PUBLIC_` são incorporadas ao
  bundle JavaScript em tempo de build. Ao alterar a URL da API, reinicie o
  ambiente (`npm run dev`) ou reconstrua a aplicação.
- Não armazenar credenciais ou segredos em variáveis `NEXT_PUBLIC_`.

> Em scaffolding, a aplicação não consome a API ainda: o backend expõe apenas
> o healthcheck (`/health`). Os recursos de domínio serão adicionados
> conforme os contratos OpenAPI forem disponibilizados.

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (saída standalone) |
| `npm run start` | Servidor de produção |
| `npm run lint` | ESLint |
| `npm run test` | Testes (Vitest) |
| `npm run test:watch` | Testes em modo watch |

## Estrutura

Estrutura de referência definida em `docs/architecture.md` (seção 5).
Cada diretório é preenchido conforme a equipe desenvolve; não há código
implementado ainda.

```
src/
├── app/            # Rotas (App Router)
├── components/     # layout, navigation, ui, charts, maps, tables
├── features/       # dashboard, nits, instituicoes, pesquisadores,
│                   # propriedade-intelectual, territorios
├── services/       # api (cliente HTTP central) e endpoints
├── hooks/
├── types/          # tipos derivados dos contratos OpenAPI
├── lib/ e utils/
tests/
```

- A camada de API está centralizada em `src/services/api/`; componentes não
  fazem chamadas HTTP diretas.
- Está implementado apenas o behavior genérico do cliente HTTP e sua
  verificação contra o endpoint de healthcheck do backend.
- Nenhum layout, tema ou identidade visual do Observatório foi implementado.

## Docker

```bash
# build (a NEXT_PUBLIC_API_URL é fixada em tempo de build)
docker build --build-arg NEXT_PUBLIC_API_URL=http://backend:8000/api/v1 -t nit-ba-frontend .
# execução
docker run -p 3000:3000 nit-ba-frontend
```

A porta é configurável via `PORT` (padrão 3000). A orquestração integrada é
responsabilidade do repositório `nit-ba-infra` (ver
`nit-ba-infra/docs/docker.md`).

## Documentação

- `docs/architecture.md` — arquitetura do frontend
- `docs/data-model.md` — modelo de dados de apresentação
- `AGENTS.md` — contexto, escopo do MVP e regras fundamentais

## Testes

```bash
npm test
```

Os testes utilizam respostas controladas (`fetch` simulado). A integração com
a API não deve ser considerada concluída com dados fictícios.

## Regras do projeto

Antes de contribuir, leia `AGENTS.md` e os documentos de `docs/`. Destaques:

- Consumo exclusivo da API REST; zero acesso direto ao banco de dados.
- Não inventar endpoints, campos ou respostas da API.
- Não converter ausência de dados em zero.
- MVP sem: transferência de tecnologia, PROFNIT, incubadoras/parques,
  anúncios e eventos, vitrine tecnológica e gestão individual dos NITs.

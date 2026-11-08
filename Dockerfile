# Imagem Node slim (Node LTS, tamanho reduzido)
FROM node:24-alpine AS deps

# Dependências da aplicação
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci


FROM node:24-alpine AS build

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_ é incorporado ao bundle em tempo de build (Next.js IMPORTANTE:
# a URL da API exposta ao navegador é fixada no build; configure o valor
# adequado ao ambiente no momento da construção da imagem).
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build


FROM node:24-alpine AS runtime

WORKDIR /app

# Saída standalone: apenas os arquivos necessários ao servidor produzido
# (requer output: "standalone" em next.config.ts)
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Execução como usuário não-root
USER node

# Porta configurável
EXPOSE ${PORT}

# Healthcheck de liveness (busybox wget, presente na imagem alpine)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/" || exit 1

CMD ["node", "server.js"]

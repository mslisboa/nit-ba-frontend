# Protótipo NIT com dados do JD Local

Este aplicativo Next.js fica isolado em `prototipos/nit-bd_local`. A interface pública cobre NITs e instituições, territórios e propriedade intelectual. A integração de pesquisadores permanece pendente.

## Executar

```sh
cd prototipos/nit-bd_local
npm ci
npm run dev
```

Abra [o protótipo](http://127.0.0.1:43122/).

- **Com amostra** é o modo inicial e funciona com o frontend sozinho. A amostra inclui as 11 instituições e os dois campi catalogados no JD, as presenças territoriais publicadas e até dois dos primeiros pedidos elegíveis da BADEPI v12 por referência e modalidade, quando disponíveis. Pedidos em comum são deduplicados no catálogo geral.
- **Sem amostra** consulta a API do JD Local na mesma máquina, em `127.0.0.1:43121`. As consultas sinalizam indisponibilidade se essa API estiver parada.

O cabeçalho identifica o modo, a data da amostra e o botão para alternar. As séries, listas e exportações do modo amostra usam a mesma seleção de processos. Os vínculos territoriais representam a localização da referência. A participação institucional em PI, a atuação do NIT e a situação jurídica seguem critérios distintos.

Esta cópia distribui somente a interface de consulta pública e uma projeção dos campos necessários à amostra. O banco operacional, o backend, os arquivos originais, o console e as credenciais são mantidos no JD Local.

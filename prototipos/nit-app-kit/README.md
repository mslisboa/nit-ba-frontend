# Protótipo visual JD — NIT App Kit

Proposta visual estática para avaliação com Matheus. Os arquivos desta pasta são uma cópia de `nit.app_kit/dist`, sem alteração da aplicação Next.js do repositório.

A V1 é a entrada padrão. A versão geral permanece disponível para comparação. Nomes institucionais são referências de navegação; pessoas, métricas e registros operacionais são demonstrativos e não constituem cadastro oficial. Não há integração com API, ETL, banco de dados ou autenticação. As telas não estabelecem contratos ou regras oficiais do MVP.

## Abrir o protótipo

Na raiz deste repositório, com Python instalado:

```sh
python -m http.server 8765 --bind 127.0.0.1 --directory prototipos/nit-app-kit
```

- V1: http://127.0.0.1:8765/
- Versão geral: http://127.0.0.1:8765/?versao=geral#inicio

Encerre com Ctrl+C. Use o servidor HTTP para carregar o mapa GeoJSON; abrir apenas o index.html pelo explorador pode impedir esse carregamento.

HTML, CSS e JavaScript sem dependências adicionais ou etapa de build. Esta branch compartilha os arquivos para revisão; não configura hospedagem nem altera a página inicial do frontend oficial.

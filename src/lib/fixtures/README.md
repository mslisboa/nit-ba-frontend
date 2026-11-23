# Fixtures demonstrativas

Os dados neste diretório são **demonstrativos** e isolam a interface da API.
Eles seguem somente os campos previstos em `docs/data-model.md` e servem para
validar navegação, filtros, agregações e estados de exibição até que os
endpoints reais estejam disponíveis.

Regras observadas:

- 12 NITs, cada um relacionado a exatamente uma instituição;
- 12 instituições, sem estruturas de unidade, endereço ou coordenada;
- 27 Territórios de Identidade e municípios com códigos IBGE oficiais;
- `instituicao_municipio` com `tipo_localizacao` (`SEDE`, `CAMPUS`, `UNIDADE`);
- associacoes NIT–PI cobrindo os quatro status de validação;
- uma PI com múltiplas associações e uma PI sem associação;
- inventores sem pesquisador vinculado mantêm `pesquisador: null`;
- nenhuma ausência de associação é convertida em `NAO_CONFIRMADA`.

Os componentes não importam estes arquivos. A camada de serviços
(`src/services/endpoints/`) é o único ponto que os consome e deve ser
substituída por chamadas HTTP sem alterar as páginas.

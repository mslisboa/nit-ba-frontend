// Links de referência do catálogo. Origem: BADEPI-JD/outputs/conferencia_humana_20261121/dados_conferencia.json.
// Os links publicados no console prevalecem. A página do DINOV documenta seu papel de NIT.
export const linksInstitucionais: Record<string, {
  instituicao: string;
  inovacao?: string;
  nitDocumentado?: boolean;
}> = {
  "UFBA": {
    "instituicao": "https://ufba.br/",
    "inovacao": "https://nit.ufba.br/"
  },
  "IFBA": {
    "instituicao": "https://portal.ifba.edu.br/",
    "inovacao": "https://portal.ifba.edu.br/prpgi/menu-departamentos/departamento-de-inovacao-2/sobre-o-dinov",
    "nitDocumentado": true
  },
  "UNEB": {
    "instituicao": "https://portal.uneb.br/",
    "inovacao": "https://inovacao.uneb.br/"
  },
  "UFRB": {
    "instituicao": "https://ufrb.edu.br/portal/",
    "inovacao": "https://www.ufrb.edu.br/ppgci/coordenacao-de-criacao-e-inovacao-cinova"
  },
  "UESB": {
    "instituicao": "https://www.uesb.br/",
    "inovacao": "https://www.uesb.br/nit/"
  },
  "UEFS": {
    "instituicao": "https://www.uefs.br/",
    "inovacao": "https://inova.uefs.br/inovauefs/institucional"
  },
  "UESC": {
    "instituicao": "https://www.uesc.br/",
    "inovacao": "https://nit.uesc.br/"
  },
  "IF BAIANO": {
    "instituicao": "https://ifbaiano.edu.br/portal/",
    "inovacao": "https://ifbaiano.edu.br/portal/pesquisa/nit/"
  },
  "UFSB": {
    "instituicao": "https://www.ufsb.edu.br/",
    "inovacao": "https://ufsb.edu.br/nit/o-nit/institucional"
  },
  "UFOB": {
    "instituicao": "https://www.ufob.edu.br/",
    "inovacao": "https://ufob.edu.br/a-ufob/estrutura/superintendencias/sitdr"
  },
  "UNIVASF": {
    "instituicao": "https://portais.univasf.edu.br/",
    "inovacao": "https://portais.univasf.edu.br/nit/nucleo-de-inovacao-tecnologica/sobre-o-nit"
  },
  "IFBA-SAJ": {
    "instituicao": "https://portal.ifba.edu.br/santoantonio"
  },
  "IFBAIANO-LAPA": {
    "instituicao": "https://www.ifbaiano.edu.br/unidades/lapa/contatos/"
  }
};

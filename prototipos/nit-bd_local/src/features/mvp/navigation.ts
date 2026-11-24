export const navegacaoMvp = [
  { titulo: "Principal", links: [
    { href: "/", label: "Início", icone: "inicio" },
    { href: "/o-que-e-nit", label: "O que é um NIT?", icone: "guia" },
  ] },
  { titulo: "Ecossistema", links: [
    { href: "/instituicoes", label: "NITs e Instituições", icone: "rede" },
    { href: "/pesquisadores", label: "Pesquisadores", icone: "pessoas" },
  ] },
  { titulo: "Inovação", links: [
    { href: "/propriedade-intelectual", label: "Propriedade intelectual", icone: "pi" },
  ] },
  { titulo: "Dados", links: [
    { href: "/indicadores", label: "Indicadores", icone: "fontes" },
    { href: "/cobertura", label: "Fontes e cobertura", icone: "fontes" },
  ] },
] as const;

export function rotaAtiva(path: string, href: string) {
  if (href === "/") return path === "/";
  if (href === "/propriedade-intelectual") return ["/propriedade-intelectual", "/patentes", "/programas-de-computador", "/marcas", "/outras-pi"].includes(path);
  return path === href || path.startsWith(href + "/");
}

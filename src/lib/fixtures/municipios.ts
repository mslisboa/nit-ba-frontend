import type { Municipality } from "@/types/municipio";
import { territoryRefByName } from "./territorios";

type MunicipalitySeed = {
  codigo_ibge: string;
  nome: string;
  territorio: string;
};

const seed: MunicipalitySeed[] = [
  { codigo_ibge: "2927408", nome: "Salvador", territorio: "Metropolitano de Salvador" },
  { codigo_ibge: "2905701", nome: "Camaçari", territorio: "Metropolitano de Salvador" },
  { codigo_ibge: "2933307", nome: "Vitória da Conquista", territorio: "Sudoeste Baiano" },
  { codigo_ibge: "2910800", nome: "Feira de Santana", territorio: "Portal do Sertão" },
  { codigo_ibge: "2913606", nome: "Ilhéus", territorio: "Litoral Sul" },
  { codigo_ibge: "2918001", nome: "Jequié", territorio: "Médio Rio de Contas" },
  { codigo_ibge: "2916401", nome: "Itapetinga", territorio: "Médio Sudoeste da Bahia" },
  { codigo_ibge: "2909802", nome: "Cruz das Almas", territorio: "Recôncavo" },
  { codigo_ibge: "2901007", nome: "Amargosa", territorio: "Vale do Jiquiriçá" },
  { codigo_ibge: "2904902", nome: "Cachoeira", territorio: "Recôncavo" },
  { codigo_ibge: "2929008", nome: "São Félix", territorio: "Recôncavo" },
  { codigo_ibge: "2928604", nome: "Santo Amaro", territorio: "Recôncavo" },
  { codigo_ibge: "2928703", nome: "Santo Antônio de Jesus", territorio: "Recôncavo" },
  { codigo_ibge: "2900702", nome: "Alagoinhas", territorio: "Litoral Norte e Agreste Baiano" },
  { codigo_ibge: "2918407", nome: "Juazeiro", territorio: "Sertão do São Francisco" },
  { codigo_ibge: "2917508", nome: "Jacobina", territorio: "Piemonte da Diamantina" },
  { codigo_ibge: "2905206", nome: "Caetité", territorio: "Sertão Produtivo" },
  { codigo_ibge: "2930105", nome: "Senhor do Bonfim", territorio: "Piemonte Norte do Itapicuru" },
  { codigo_ibge: "2924009", nome: "Paulo Afonso", territorio: "Itaparica" },
  { codigo_ibge: "2903201", nome: "Barreiras", territorio: "Bacia do Rio Grande" },
  { codigo_ibge: "2931350", nome: "Teixeira de Freitas", territorio: "Extremo Sul" },
  { codigo_ibge: "2930501", nome: "Serrinha", territorio: "Sisal" },
  { codigo_ibge: "2911709", nome: "Guanambi", territorio: "Sertão Produtivo" },
  { codigo_ibge: "2914703", nome: "Itaberaba", territorio: "Piemonte do Paraguaçu" },
  { codigo_ibge: "2908408", nome: "Conceição do Coité", territorio: "Sisal" },
  { codigo_ibge: "2932903", nome: "Valença", territorio: "Baixo Sul" },
  { codigo_ibge: "2910727", nome: "Eunápolis", territorio: "Costa do Descobrimento" },
  { codigo_ibge: "2914604", nome: "Irecê", territorio: "Irecê" },
  { codigo_ibge: "2903904", nome: "Bom Jesus da Lapa", territorio: "Velho Chico" },
  { codigo_ibge: "2913903", nome: "Ipiaú", territorio: "Médio Rio de Contas" },
  { codigo_ibge: "2904605", nome: "Brumado", territorio: "Sertão Produtivo" },
  { codigo_ibge: "2910701", nome: "Euclides da Cunha", territorio: "Semiárido Nordeste II" },
  { codigo_ibge: "2929909", nome: "Seabra", territorio: "Chapada Diamantina" },
  { codigo_ibge: "2933604", nome: "Xique-Xique", territorio: "Irecê" },
  { codigo_ibge: "2919207", nome: "Lauro de Freitas", territorio: "Metropolitano de Salvador" },
  { codigo_ibge: "2918100", nome: "Jeremoabo", territorio: "Semiárido Nordeste II" },
  { codigo_ibge: "2906824", nome: "Canudos", territorio: "Sertão do São Francisco" },
  { codigo_ibge: "2902708", nome: "Barra", territorio: "Velho Chico" },
  { codigo_ibge: "2919553", nome: "Luís Eduardo Magalhães", territorio: "Bacia do Rio Grande" },
  { codigo_ibge: "2928109", nome: "Santa Maria da Vitória", territorio: "Bacia do Rio Corrente" },
  { codigo_ibge: "2914802", nome: "Itabuna", territorio: "Litoral Sul" },
  { codigo_ibge: "2925303", nome: "Porto Seguro", territorio: "Costa do Descobrimento" },
  { codigo_ibge: "2906006", nome: "Campo Formoso", territorio: "Piemonte Norte do Itapicuru" },
  { codigo_ibge: "2917607", nome: "Jaguaquara", territorio: "Vale do Jiquiriçá" },
  { codigo_ibge: "2930709", nome: "Simões Filho", territorio: "Metropolitano de Salvador" },
];

export const municipalityFixtures: Municipality[] = seed.map(
  (municipality, index) => ({
    id: index + 1,
    codigo_ibge: municipality.codigo_ibge,
    nome: municipality.nome,
    territorio: territoryRefByName(municipality.territorio),
  }),
);

export const municipalityById = new Map(
  municipalityFixtures.map((municipality) => [municipality.id, municipality]),
);

export const municipalityByName = new Map(
  municipalityFixtures.map((municipality) => [municipality.nome, municipality]),
);

export function municipalityRef(id: number) {
  const municipality = municipalityById.get(id);

  if (!municipality) {
    throw new Error(`Município não encontrado na fixture: ${id}`);
  }

  return {
    id: municipality.id,
    codigo_ibge: municipality.codigo_ibge,
    nome: municipality.nome,
  };
}

export function municipalityRefByName(nome: string) {
  const municipality = municipalityByName.get(nome);

  if (!municipality) {
    throw new Error(`Município não encontrado na fixture: ${nome}`);
  }

  return municipalityRef(municipality.id);
}

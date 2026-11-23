import type {
  Institution,
  InstitutionMunicipalityReference,
} from "@/types/instituicao";
import type { NITReference } from "@/types/common";
import { institutionRefs, nitRefs } from "./refs";
import { municipalityRefByName } from "./municipios";

type LocationSeed = {
  municipio: string;
  tipo_localizacao: "SEDE" | "CAMPUS" | "UNIDADE";
};

type InstitutionSeed = {
  id: number;
  natureza: string;
  tipo: string;
  site: string;
  nitId: number;
  locations: LocationSeed[];
};

const seeds: InstitutionSeed[] = [
  {
    id: 1,
    natureza: "Federal",
    tipo: "Universidade",
    site: "https://nit.ufba.br/",
    nitId: 1,
    locations: [
      { municipio: "Salvador", tipo_localizacao: "SEDE" },
      { municipio: "Camaçari", tipo_localizacao: "CAMPUS" },
      { municipio: "Vitória da Conquista", tipo_localizacao: "CAMPUS" },
    ],
  },
  {
    id: 2,
    natureza: "Estadual",
    tipo: "Universidade",
    site: "https://inova.uefs.br/",
    nitId: 2,
    locations: [{ municipio: "Feira de Santana", tipo_localizacao: "SEDE" }],
  },
  {
    id: 3,
    natureza: "Estadual",
    tipo: "Universidade",
    site: "https://www.uesc.br/nucleos/nit/",
    nitId: 3,
    locations: [{ municipio: "Ilhéus", tipo_localizacao: "SEDE" }],
  },
  {
    id: 4,
    natureza: "Estadual",
    tipo: "Universidade",
    site: "http://www2.uesb.br/nit/",
    nitId: 4,
    locations: [
      { municipio: "Vitória da Conquista", tipo_localizacao: "SEDE" },
      { municipio: "Jequié", tipo_localizacao: "CAMPUS" },
      { municipio: "Itapetinga", tipo_localizacao: "CAMPUS" },
    ],
  },
  {
    id: 5,
    natureza: "Federal",
    tipo: "Universidade",
    site: "https://ufrb.edu.br/ppgci/coordenacao-de-criacao-e-inovacao-cinova",
    nitId: 5,
    locations: [
      { municipio: "Cruz das Almas", tipo_localizacao: "SEDE" },
      { municipio: "Amargosa", tipo_localizacao: "CAMPUS" },
      { municipio: "Cachoeira", tipo_localizacao: "CAMPUS" },
      { municipio: "São Félix", tipo_localizacao: "CAMPUS" },
      { municipio: "Feira de Santana", tipo_localizacao: "CAMPUS" },
      { municipio: "Santo Amaro", tipo_localizacao: "CAMPUS" },
      { municipio: "Santo Antônio de Jesus", tipo_localizacao: "CAMPUS" },
    ],
  },
  {
    id: 6,
    natureza: "Estadual",
    tipo: "Universidade",
    site: "https://inovacao.uneb.br/",
    nitId: 6,
    locations: [
      { municipio: "Salvador", tipo_localizacao: "SEDE" },
      { municipio: "Alagoinhas", tipo_localizacao: "UNIDADE" },
      { municipio: "Juazeiro", tipo_localizacao: "UNIDADE" },
      { municipio: "Jacobina", tipo_localizacao: "UNIDADE" },
      { municipio: "Santo Antônio de Jesus", tipo_localizacao: "UNIDADE" },
      { municipio: "Caetité", tipo_localizacao: "UNIDADE" },
      { municipio: "Senhor do Bonfim", tipo_localizacao: "UNIDADE" },
      { municipio: "Paulo Afonso", tipo_localizacao: "UNIDADE" },
      { municipio: "Barreiras", tipo_localizacao: "UNIDADE" },
      { municipio: "Teixeira de Freitas", tipo_localizacao: "UNIDADE" },
      { municipio: "Serrinha", tipo_localizacao: "UNIDADE" },
      { municipio: "Guanambi", tipo_localizacao: "UNIDADE" },
      { municipio: "Itaberaba", tipo_localizacao: "UNIDADE" },
      { municipio: "Conceição do Coité", tipo_localizacao: "UNIDADE" },
      { municipio: "Valença", tipo_localizacao: "UNIDADE" },
      { municipio: "Camaçari", tipo_localizacao: "UNIDADE" },
      { municipio: "Eunápolis", tipo_localizacao: "UNIDADE" },
      { municipio: "Irecê", tipo_localizacao: "UNIDADE" },
      { municipio: "Bom Jesus da Lapa", tipo_localizacao: "UNIDADE" },
      { municipio: "Ipiaú", tipo_localizacao: "UNIDADE" },
      { municipio: "Brumado", tipo_localizacao: "UNIDADE" },
      { municipio: "Euclides da Cunha", tipo_localizacao: "UNIDADE" },
      { municipio: "Seabra", tipo_localizacao: "UNIDADE" },
      { municipio: "Xique-Xique", tipo_localizacao: "UNIDADE" },
      { municipio: "Lauro de Freitas", tipo_localizacao: "UNIDADE" },
      { municipio: "Jeremoabo", tipo_localizacao: "UNIDADE" },
      { municipio: "Canudos", tipo_localizacao: "UNIDADE" },
    ],
  },
  {
    id: 7,
    natureza: "Federal",
    tipo: "Universidade",
    site: "https://ufob.edu.br/a-ufob/inovacao/propriedade-intelectual-e-transferencia-de-tecnologia",
    nitId: 7,
    locations: [
      { municipio: "Barreiras", tipo_localizacao: "SEDE" },
      { municipio: "Barra", tipo_localizacao: "CAMPUS" },
      { municipio: "Bom Jesus da Lapa", tipo_localizacao: "CAMPUS" },
      { municipio: "Luís Eduardo Magalhães", tipo_localizacao: "CAMPUS" },
      { municipio: "Santa Maria da Vitória", tipo_localizacao: "CAMPUS" },
    ],
  },
  {
    id: 8,
    natureza: "Federal",
    tipo: "Universidade",
    site: "https://ufsb.edu.br/",
    nitId: 8,
    locations: [
      { municipio: "Itabuna", tipo_localizacao: "SEDE" },
      { municipio: "Porto Seguro", tipo_localizacao: "CAMPUS" },
      { municipio: "Teixeira de Freitas", tipo_localizacao: "CAMPUS" },
    ],
  },
  {
    id: 9,
    natureza: "Sistema S",
    tipo: "Centro Universitário",
    site: "https://www.senaicimatec.com.br/pesquisa-e-inovacao/",
    nitId: 9,
    locations: [{ municipio: "Salvador", tipo_localizacao: "SEDE" }],
  },
  {
    id: 10,
    natureza: "Privada sem fins lucrativos",
    tipo: "Escola",
    site: "https://www.bahiana.edu.br/inovacao-parcerias/",
    nitId: 10,
    locations: [{ municipio: "Salvador", tipo_localizacao: "SEDE" }],
  },
  {
    id: 11,
    natureza: "Federal",
    tipo: "Instituto Federal",
    site: "",
    nitId: 11,
    locations: [
      { municipio: "Salvador", tipo_localizacao: "SEDE" },
      { municipio: "Barreiras", tipo_localizacao: "CAMPUS" },
      { municipio: "Brumado", tipo_localizacao: "CAMPUS" },
      { municipio: "Camaçari", tipo_localizacao: "CAMPUS" },
      { municipio: "Campo Formoso", tipo_localizacao: "CAMPUS" },
      { municipio: "Euclides da Cunha", tipo_localizacao: "CAMPUS" },
      { municipio: "Eunápolis", tipo_localizacao: "CAMPUS" },
      { municipio: "Feira de Santana", tipo_localizacao: "CAMPUS" },
      { municipio: "Ilhéus", tipo_localizacao: "CAMPUS" },
      { municipio: "Irecê", tipo_localizacao: "CAMPUS" },
      { municipio: "Jacobina", tipo_localizacao: "CAMPUS" },
      { municipio: "Jaguaquara", tipo_localizacao: "CAMPUS" },
      { municipio: "Jequié", tipo_localizacao: "CAMPUS" },
      { municipio: "Juazeiro", tipo_localizacao: "CAMPUS" },
      { municipio: "Lauro de Freitas", tipo_localizacao: "CAMPUS" },
      { municipio: "Paulo Afonso", tipo_localizacao: "CAMPUS" },
      { municipio: "Porto Seguro", tipo_localizacao: "CAMPUS" },
      { municipio: "Santo Amaro", tipo_localizacao: "CAMPUS" },
      { municipio: "Santo Antônio de Jesus", tipo_localizacao: "CAMPUS" },
      { municipio: "Seabra", tipo_localizacao: "CAMPUS" },
      { municipio: "Simões Filho", tipo_localizacao: "CAMPUS" },
      { municipio: "Valença", tipo_localizacao: "CAMPUS" },
      { municipio: "Vitória da Conquista", tipo_localizacao: "CAMPUS" },
    ],
  },
  {
    id: 12,
    natureza: "Federal",
    tipo: "Fundação",
    site: "",
    nitId: 12,
    locations: [{ municipio: "Salvador", tipo_localizacao: "SEDE" }],
  },
];

function nitRef(id: number): NITReference {
  const nit = nitRefs.find((item) => item.id === id);

  if (!nit) {
    throw new Error(`NIT não encontrado na fixture: ${id}`);
  }

  return nit;
}

function buildMunicipalities(
  locations: LocationSeed[],
): InstitutionMunicipalityReference[] {
  return locations.map((location) => ({
    municipio: municipalityRefByName(location.municipio),
    tipo_localizacao: location.tipo_localizacao,
  }));
}

export const institutionFixtures: Institution[] = seeds.map((seed) => {
  const reference = institutionRefs.find((item) => item.id === seed.id);

  if (!reference) {
    throw new Error(`Instituição não encontrada na fixture: ${seed.id}`);
  }

  return {
    ...reference,
    natureza: seed.natureza,
    tipo: seed.tipo,
    site: seed.site || null,
    nit: nitRef(seed.nitId),
    municipios: buildMunicipalities(seed.locations),
  };
});

export const institutionById = new Map(
  institutionFixtures.map((institution) => [institution.id, institution]),
);

export function institutionRef(id: number) {
  const institution = institutionFixtures.find((item) => item.id === id);

  if (!institution) {
    throw new Error(`Instituição não encontrada na fixture: ${id}`);
  }

  return {
    id: institution.id,
    nome: institution.nome,
    sigla: institution.sigla,
  };
}

import type {
  IntellectualPropertyReference,
  NITReference,
} from "./common";
import type { MetodoIdentificacao, MetodoValidacao, StatusValidacao } from "./validacao";

/**
 * Associação entre um NIT e uma propriedade intelectual.
 *
 * É a única fonte de verdade para indicar que uma PI passou por um NIT.
 * O frontend apenas apresenta o status retornado pelo backend.
 */
export interface PINitAssociation {
  nit: NITReference;
  propriedade_intelectual: IntellectualPropertyReference;
  status_validacao: StatusValidacao;
  metodo_identificacao: MetodoIdentificacao;
  metodo_validacao?: MetodoValidacao | null;
  data_identificacao: string;
  data_validacao?: string | null;
  referencia_evidencia?: string | null;
  observacao?: string | null;
}

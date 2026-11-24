export function PendenteMvp({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return <section className="jd-panel"><h1>{titulo}</h1><aside className="jd-notice"><strong>Não disponível nesta consulta</strong><p>{children}</p></aside><p>A ausência de um catálogo integrado não representa quantidade zero. Os dados serão apresentados após validação das fontes e do contrato da API.</p></section>;
}

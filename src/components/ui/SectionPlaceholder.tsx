import { PageHero } from "@/components/ui/PageHero";

type SectionPlaceholderProps = {
  title: string;
  description: string;
};

export function SectionPlaceholder({
  title,
  description,
}: SectionPlaceholderProps) {
  return (
    <div className="page v1-page">
      <PageHero title={title} description={description} />
      <section className="page-body">
        <div className="wrap">
          <div className="empty-state">
            <b>Conteúdo em implementação</b>
            <span>
              Esta área será preenchida na etapa de páginas do MVP, com dados
              demonstrativos vindos da camada de serviços.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

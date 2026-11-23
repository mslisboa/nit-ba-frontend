import Link from "next/link";

type PageHeroProps = {
  title: string;
  description: string;
  count?: number;
};

export function PageHero({ title, description, count }: PageHeroProps) {
  return (
    <section className="subpage-hero">
      <div className="wrap">
        <nav className="kit-breadcrumb" aria-label="Caminho da página">
          <Link href="/">Início</Link>
          <span aria-hidden="true">/</span>
          <span>{title}</span>
        </nav>
        <div className="subpage-title">
          <div>
            <h1>{title}</h1>
            <p className="lede">{description}</p>
          </div>
          {typeof count === "number" ? (
            <div className="count-card">
              <strong>{count}</strong>
              <span>registros na amostra</span>
              <small>Dados demonstrativos</small>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

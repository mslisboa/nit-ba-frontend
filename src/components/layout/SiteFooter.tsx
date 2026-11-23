import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Observatório de CT&amp;I da Bahia</strong>
        <p>
          Entidades públicas são usadas como referência; métricas e registros
          operacionais são fictícios.
        </p>
      </div>
      <div className="footer-links">
        <Link href="/indicadores">Indicadores</Link>
        <Link href="/fontes">Fontes e metodologia</Link>
      </div>
    </footer>
  );
}

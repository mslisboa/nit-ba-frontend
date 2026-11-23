"use client";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="wrap" style={{ paddingTop: 48, paddingBottom: 48 }}>
      <h1>Erro ao carregar os dados</h1>
      <p>{error.message || "Ocorreu um erro inesperado."}</p>
      <button className="button" type="button" onClick={() => reset()}>
        Tentar novamente
      </button>
    </section>
  );
}

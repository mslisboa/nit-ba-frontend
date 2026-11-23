import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  getPageHref: (page: number) => string;
};

export function Pagination({ page, totalPages, getPageHref }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="Paginação">
      {page > 1 ? (
        <Link href={getPageHref(page - 1)} aria-label="Página anterior">
          Anterior
        </Link>
      ) : (
        <span aria-disabled="true">Anterior</span>
      )}

      <ol>
        {pages.map((pageNumber) => (
          <li key={pageNumber}>
            {pageNumber === page ? (
              <span aria-current="page">{pageNumber}</span>
            ) : (
              <Link href={getPageHref(pageNumber)}>{pageNumber}</Link>
            )}
          </li>
        ))}
      </ol>

      {page < totalPages ? (
        <Link href={getPageHref(page + 1)} aria-label="Próxima página">
          Próxima
        </Link>
      ) : (
        <span aria-disabled="true">Próxima</span>
      )}
    </nav>
  );
}

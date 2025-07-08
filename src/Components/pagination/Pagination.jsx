
import { PageButton } from "../Button/Button";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageLimit = 10;
  const currentPageGroup = Math.floor(currentPage / pageLimit);
  const startPage = currentPageGroup * pageLimit;
  const endPage = Math.min(startPage + pageLimit, totalPages);
  



  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {currentPageGroup > 0 && (
        <PageButton onClick={() => onPageChange(startPage - 1)}>
          &hellip;
        </PageButton>
      )}

      <PageButton
        className={`${currentPage === 0 ? "hidden" : "block"}`}
        onClick={() => onPageChange((p) => Math.max(p - 1, 0))}
      >
        이전
      </PageButton>

      {Array.from(
        { length: endPage - startPage },
        (_, i) => startPage + i
      ).map((n) => (
        <PageButton
          key={n}
          onClick={() => onPageChange(n)}
          className={`px-3 py-1 rounded ${
            n === currentPage ? "bg-lime-400 text-white" : "bg-gray-200"
          }`}
        >
          {n + 1}
        </PageButton>
      ))}

      <PageButton
        className={`${currentPage === totalPages - 1 ? "hidden" : "block"}`}
        onClick={() => onPageChange((p) => Math.min(p + 1, totalPages - 1))}
      >
        다음
      </PageButton>

      {endPage < totalPages && (
        <PageButton onClick={() => onPageChange(endPage)}>
          &hellip;
        </PageButton>
      )}
    </div>
  );
}

export default Pagination;
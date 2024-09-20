import React from "react";
import "../styles/Pagination.css";

interface PaginationProps {
  totalJobs: number;
  jobsPerPage: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalJobs,
  jobsPerPage,
  currentPage,
  paginate,
}) => {
  const previousPage = currentPage === 1 ? currentPage : currentPage - 1;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const nextPage = currentPage === totalPages ? currentPage : currentPage + 1;
  const pageNumbers: (number | string)[] = [];

  const pushPageNumber = (number: number | string) => {
    if (!pageNumbers.includes(number)) {
      pageNumbers.push(number);
    }
  };

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pushPageNumber(i);
    }
  } else {
    pushPageNumber(1);

    if (currentPage > 3) {
      pushPageNumber("...");
    }

    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pushPageNumber(i);
    }

    if (currentPage < totalPages - 2) {
      pushPageNumber("...");
    }

    pushPageNumber(totalPages);
  }

  return (
    <nav className="pagination-nav">
      <ul className="pagination">
        <li>
          <button onClick={() => paginate(1)} className="page-link">
            {"<<"}
          </button>
        </li>
        <li>
          <button onClick={() => paginate(previousPage)} className="page-link">
            {"<"}
          </button>
        </li>
        {pageNumbers.map((number, index) => (
          <li
            key={index}
            className={`page-item ${number === currentPage ? "active" : ""}`}
            onClick={() => typeof number === "number" && paginate(number)}
          >
            {typeof number === "number" ? (
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            ) : (
              <span className="pagination-ellipsis">...</span>
            )}
          </li>
        ))}
        <li>
          <button onClick={() => paginate(nextPage)} className="page-link">
            {">"}
          </button>
        </li>
        <li>
          <button onClick={() => paginate(totalPages)} className="page-link">
            {">>"}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;

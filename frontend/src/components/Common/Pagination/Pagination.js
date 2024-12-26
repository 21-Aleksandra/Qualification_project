import React from "react";
import { observer } from "mobx-react-lite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAnglesRight,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "./Pagination.css";

//Generic component for pagination, requieres specific setting in the stores (see EventStore)
// The 'observer'  ensures the component re-renders when the store's state changes
const Pagination = observer(({ store }) => {
  // Destructure values from the MobX store to use in the component
  // _currentPage is the current page the user is on
  // totalPages is the total number of pages available
  const currentPage = store._currentPage;
  const totalPages = store.totalPages;

  // Function to handle page changes when a user clicks on a page button or navigation button
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      store.setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const maxPageButtons = 3; // max amount of buttons with page numbers

    // Calculate half of the maxPageButtons to center the page numbers around the current page
    const halfRange = Math.floor(maxPageButtons / 2);

    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, currentPage + halfRange);

    if (endPage - startPage + 1 < maxPageButtons) {
      if (startPage === 1) {
        // If the startPage is 1, we extend the endPage to show the maximum number of buttons
        endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
      } else if (endPage === totalPages) {
        // If the endPage is the last page, we extend the startPage backward
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }
    }

    // Generate an array of page numbers to display, from startPage to endPage
    let pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-wrapper">
      <div className="flex justify-center items-center gap-6">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          <FontAwesomeIcon icon={faAnglesLeft} />
        </button>

        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="pagination-button"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`pagination-button ${
              page === currentPage ? "active" : "" // Add "active" class if it's the current page
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Page Button - Navigate to the next page */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="pagination-button"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>

        {/* Last Page Button - Jump to the last page */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </div>
    </div>
  );
});

export default Pagination;

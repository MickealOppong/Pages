import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './../css/Pagination.css';


const Pagination =({ currentPage, totalPages}:{currentPage:number, totalPages:number}) => {
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(currentPage);
  const [total] = useState<number>(totalPages);
   const [, setSearchParams] = useSearchParams();

const navigate = useNavigate()
  
  if (total <= 1) return null;

const onPageChange = (page:number)=>{
const queryParams = new URLSearchParams(window.location.search);
 queryParams.set('page',String(page))

   setSearchParams(queryParams);
     localStorage.setItem('filter',JSON.stringify(queryParams))
    navigate(`?${queryParams}`)
  
}


  const getVisiblePageNumbers = () => {
    const maxVisible = 5;
    
    // Fallback: If total pages are fewer than 5, render only what is available
    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Determine the ideal starting coordinate to keep the active page centered
    let startPage = Math.max(currentPageNumber - 2, 1);
    let endPage = startPage + maxVisible - 1;

    // Boundary Protection Left Edge: If window drops below 1, anchor to page 1
    if (startPage <= 1) {
      startPage = 1;
      endPage = maxVisible;
    }

    // Boundary Protection Right Edge: If window overflows total limits, shift backward
    if (endPage >= total) {
      endPage = total;
      startPage = total - maxVisible + 1;
    }

    // Generate the exact 5 items matching the sliding bounds array window
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const visiblePages = getVisiblePageNumbers();


  const goLeft = (page: number) => {
    let nextPage = page - 1;
    if (page <= 1) {
      nextPage = total;
    }
    setCurrentPageNumber(nextPage);
    if (onPageChange) onPageChange(nextPage); // Triggers your API backend reload hook
  };

  const goRight = (page: number) => {
    let nextPage = page + 1;
    if (page >= total) {
      nextPage = 1;
    }
    setCurrentPageNumber(nextPage);
    if (onPageChange) onPageChange(nextPage); // Triggers your API backend reload hook
  };

  const handleDirectPageClick = (page: number) => {
    setCurrentPageNumber(page);
    if (onPageChange) onPageChange(page);
  };

  return (
    <div className="pagination-container">
      {/* Back directional control - REMOVED disabled property to allow infinite wrapping loops */}
      <button 
        className="nav-arrow-btn"
        onClick={() => goLeft(currentPageNumber)}
        type="button"
      >
        <FiChevronLeft size={18} />
      </button>

      {/* Numeric page index tracking block (Loops through exactly 5 dynamic values) */}
      <div className="page-numbers-group">
        {visiblePages.map((pageNum) => (
          <button
            key={pageNum}
            className={`number-btn ${currentPageNumber === pageNum ? 'active' : ''}`}
            onClick={() => handleDirectPageClick(pageNum)}
            type="button"
          >
            {pageNum}
          </button>
        ))}
      </div>

      {/* Forward directional control - REMOVED disabled property to allow infinite wrapping loops */}
      <button 
        className="nav-arrow-btn"
        onClick={() => goRight(currentPageNumber)}
        type="button"
      >
        <FiChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;

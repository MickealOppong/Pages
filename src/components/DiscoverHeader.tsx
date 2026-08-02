import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiFilter } from 'react-icons/fi';
import './../css/DiscoverHeader.css';
import DiscoveryFilters from './DiscoveryFilters';

const DiscoverHeader =() =>{
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  //translation hook
  const {t} = useTranslation();

  // Close automatically if user presses the Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFilterOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close automatically if user clicks completely outside the filter module
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="discover_header" ref={containerRef}>
      <div className="header_container">
        <div className="header_message">
          <h2>{t('DiscoverFeed.brand_name')}</h2>
          <p>{t('DiscoverFeed.tagline')}</p>
        </div>
           <button 
          type="button" 
          className={`filter_btn ${isFilterOpen ? 'active' : ''}`}
          aria-expanded={isFilterOpen}
          aria-controls="filter-drawer"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <FiFilter size={32} />
        </button>
       <div className="auth-message">
          <span>{t('DiscoverFeed.profile_meta.header_message')}</span>
          <span>{t('DiscoverFeed.profile_meta.sub_message')}</span>
        </div>
     
      </div>

      {/* STAGGERED ACCORDION DRAWER CONTAINER */}
      <div 
        id="filter-drawer"
        className={`accordion-wrapper ${isFilterOpen ? 'is-open' : ''}`}
        aria-hidden={!isFilterOpen}
      >
        <div className="accordion-inner">
          {/* Stagger rules applied via explicit children wrapping nodes */}
          <div className="stagger-child" style={{ '--stagger-index': 1 } as React.CSSProperties}>
            {/* Activity Input */}
          </div>
          <div className="stagger-child" style={{ '--stagger-index': 2 } as React.CSSProperties}>
            {/* City Input */}
          </div>
          <div className="stagger-child" style={{ '--stagger-index': 3 } as React.CSSProperties}>
            {/* Age Input */}
          </div>
          <div className="stagger-child" style={{ '--stagger-index': 4 } as React.CSSProperties}>
            {/* Gender Input */}
          </div>
          <div className="stagger-child" style={{ '--stagger-index': 5 } as React.CSSProperties}>
            {/* Submit Button */}
          </div>
          
          {/* Or render your previous form component cleanly directly inside */}
          <DiscoveryFilters/>
        </div>
      </div>
    </header>
  );
}
export default DiscoverHeader
import { useTranslation } from "react-i18next";
import { FiLoader, FiMapPin } from "react-icons/fi";
import type { TLocationResponse } from "../types/TLocationResponse";
import './../css/LocationSelector.css';
interface LocationSelectorProps {
  location: string;
  locationList: TLocationResponse[];
  extractedData: boolean;
  isDropdownOpen: boolean;
  isLocating: boolean;
  locationError: string | null;
  latitude: number;
  longitude: number;
  countryCode: string;
  setIsHoveringDropdown: (hovering: boolean) => void;
  handleInputChange: (value: string) => void;
  handleInputBlur: () => void;
  handleSelectCity: (loc: TLocationResponse) => void;
  handleDetectLocation: () => void;
}

export default function LocationSelector({
  location,
  locationList,
  extractedData,
  isDropdownOpen,
  isLocating,
  locationError,
  latitude,
  longitude,
  countryCode,
  setIsHoveringDropdown,
  handleInputChange,
  handleInputBlur,
  handleSelectCity,
  handleDetectLocation
}: LocationSelectorProps) {

  const {t} = useTranslation();



  return (
    <div className="location-selector-container register">
      <div className="input-action-row">
        <input
          id="city-input"
          type="text"
          value={location}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={handleInputBlur}
          placeholder={t('ProfilePage.sections.search.placeholder')}
          autoComplete="off"
          className={`city-text-input register ${extractedData ? "is-valid" : ""}`}
        />
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={isLocating}
          className={`geolocation-btn ${isLocating ? "is-loading" : ""}`}
          aria-label="Detect current location"
        >
          {isLocating ? <FiLoader className="spin-animate" /> : <FiMapPin/>}
          <span>{t('ProfilePage.sections.search.title')}</span>
        </button>
      </div>

      {locationError && (
        <p className="location-error-msg">
          {t(`ProfilePage.sections.search.${locationError}`)}
        </p>
      )}

      {/* Hidden Fields for Parent Form Context Extraction */}
      {extractedData && (
        <>
          <input type="hidden" name="lat" value={latitude} />
          <input type="hidden" name="lon" value={longitude} />
          <input type="hidden" name="countryCode" value={countryCode} />
        </>
      )}

      {/* Floating Suggestions List Panel overlay layout */}
      {isDropdownOpen && locationList.length > 0 && (
        <ul
          className="suggestions-dropdown-list"
          onMouseEnter={() => setIsHoveringDropdown(true)}
          onMouseLeave={() => setIsHoveringDropdown(false)}
        >
          {locationList.map((loc, index) => (
            <li
              key={`${loc.lat}-${loc.lon}-${index}`}
              onClick={() => handleSelectCity(loc)}
              className="suggestion-item"
            >
              <strong className="city-name-highlight">{loc.city}</strong>, {loc.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

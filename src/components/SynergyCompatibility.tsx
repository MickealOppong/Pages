import { useTranslation } from 'react-i18next';
import { FiX } from 'react-icons/fi';
import type { TMatchResultDto } from '../types/TMatchResultDto';
import './../css/matchCompact.css';

// Keep your standard getCleanTagConfig parser function active here unchanged...
// Reusing your clean token configs
export const getCleanTagConfig = (rawTag: string) => {
  const cleanKey = (value: string) => value.replace(/[-\s]/g, "_").toUpperCase();

  if (rawTag.startsWith("LOOKING_FOR_")) {
    return { label: `LookingFor.${cleanKey(rawTag.replace("LOOKING_FOR_", ""))}`, icon: "❤️" };
  }
  if (rawTag.startsWith("PET_")) {
    return { label: `Questions.${cleanKey(rawTag.replace("PET_", ""))}`, icon: "🐾" };
  }
  if (rawTag.startsWith("EDUCATION_")) {
    return { label: `Education.${cleanKey(rawTag.replace("EDUCATION_", ""))}`, icon: "🎓" };
  }
  if (rawTag.startsWith("DRINKING_")) {
    return { label: `Lifestyle.${cleanKey(rawTag.replace("DRINKING_", ""))}`, icon: "🍹" };
  }
  if (rawTag.startsWith("SMOKING_")) {
    return { label: `Lifestyle.${cleanKey(rawTag.replace("SMOKING_", ""))}`, icon: "🚬" };
  }
  return { label: `Moments.${rawTag.trim().toUpperCase()}`, icon: "📸" };
};

interface SynergyCompatibilityProps {
  matchData: TMatchResultDto | null;
  targetUsername: string;
  isLoading: boolean;
  onClose: () => void;
}

const SynergyCompatibility = ({ matchData, targetUsername, isLoading, onClose }: SynergyCompatibilityProps) => {
  const { t } = useTranslation();

  if (isLoading || !matchData) {
    return (
      <div className="compatibility-chart-container is-loading-state">
        <div className="loading-shimmer-ring"></div>
        <p>{t('Compatibility.loading', 'Analyzing alignment profiles...')}</p>
      </div>
    );
  }

  const { compatibilityScore, sharedHobbies = [], userAUniqueHobbies = [], userBUniqueHobbies = [] } = matchData;

  const countShared = sharedHobbies.length;
  const countA = userAUniqueHobbies.length;
  const countB = userBUniqueHobbies.length;
  const maxAxisValue = Math.max(countShared, countA, countB, 4);

  const renderPillCloud = (tagsArray: string[], variantClass: string) => {
    return tagsArray.map((tag) => {
      const { label, icon } = getCleanTagConfig(tag);
      return (
        <div key={tag} className={`metric-detail-pill ${variantClass}`}>
          <span className="pill-icon">{icon}</span>
          <span className="pill-text">{t(label, tag)}</span>
        </div>
      );
    });
  };

  return (
    <div className="compatibility-chart-container is-sheet-panel">
      <button className="sheet-dismiss-btn" onClick={onClose} aria-label="Close panel">
        <FiX />
      </button>

      <div className="chart-header-row-wrapper">
        <div className="chart-header-text-block">
          <h4>{t('Compatibility.chart_title', 'What you have in common')}</h4>
          <p className="chart-subtitle">
            {t('Compatibility.chart_desc', '{{shared}} shared interests, with unique interests for each person.', { shared: countShared })}
          </p>
        </div>

        <div className="gauge-score-sector" style={{ '--score-pct': `${compatibilityScore}%` } as React.CSSProperties}>
          <div className="gauge-inner-content">
            <span className="gauge-percent-digit">{compatibilityScore}%</span>
            <span className="gauge-subtext">{t('Compatibility.match_label', 'Match')}</span>
          </div>
        </div>
      </div>

      <div className="horizontal-graph-canvas">
        <div className="graph-gridlines-overlay">
          <div className="gridline"></div><div className="gridline"></div><div className="gridline"></div><div className="gridline"></div>
        </div>

        <div className="graph-row-wrapper">
          <span className="row-axis-title">{t('Compatibility.row_shared', 'Shared interests')}</span>
          <div className="bar-track-area">
            <div className="horizontal-data-bar shared-bar" style={{ width: `${(countShared / maxAxisValue) * 100}%` }}>
              {countShared > 0 && <span className="bar-inline-val">{countShared}</span>}
            </div>
          </div>
        </div>

        <div className="graph-row-wrapper">
          <span className="row-axis-title">{t('Compatibility.row_you', 'Your unique inter...')}</span>
          <div className="bar-track-area">
            <div className="horizontal-data-bar unique-a-bar" style={{ width: `${(countA / maxAxisValue) * 100}%` }}>
              {countA > 0 && <span className="bar-inline-val">{countA}</span>}
            </div>
          </div>
        </div>

        <div className="graph-row-wrapper">
          <span className="row-axis-title">{t('Compatibility.row_them', 'Their unique inte...')}</span>
          <div className="bar-track-area">
            <div className="horizontal-data-bar unique-b-bar" style={{ width: `${(countB / maxAxisValue) * 100}%` }}>
              {countB > 0 && <span className="bar-inline-val">{countB}</span>}
            </div>
          </div>
        </div>

        <div className="graph-x-axis-labels">
          <span>0</span><span>{Math.round(maxAxisValue * 0.33)}</span><span>{Math.round(maxAxisValue * 0.66)}</span><span>{maxAxisValue}</span>
        </div>
      </div>

      <div className="details-breakdown-stack">
        {countShared > 0 && (
          <div className="details-section-card shared-box">
            <h5>🤝 {t('Compatibility.details_shared', 'You both share')}</h5>
            <div className="details-chips-cloud">{renderPillCloud(sharedHobbies, 'is-shared')}</div>
          </div>
        )}

        {(countA > 0 || countB > 0) && (
          <div className="details-section-card unique-box">
            <h5>✨ {t('Compatibility.details_unique', 'Unique Lifestyle Traits')}</h5>
            {countA > 0 && (
              <div className="sub-user-cloud">
                <span className="sub-cloud-title">👤 {t('Generic.you', 'You')}</span>
                <div className="details-chips-cloud">{renderPillCloud(userAUniqueHobbies, 'is-you')}</div>
              </div>
            )}
            {countB > 0 && (
              <div className="sub-user-cloud">
                <span className="sub-cloud-title">💫 {targetUsername}</span>
                <div className="details-chips-cloud">{renderPillCloud(userBUniqueHobbies, 'is-them')}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SynergyCompatibility;

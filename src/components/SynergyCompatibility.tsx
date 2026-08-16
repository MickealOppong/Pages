import { useTranslation } from 'react-i18next';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { FaSmoking } from 'react-icons/fa';
import { FiActivity, FiArrowRight, FiHeart, FiX } from 'react-icons/fi';
import { IoSchool } from 'react-icons/io5';
import { MdPets } from 'react-icons/md';
import { RiBeerFill } from 'react-icons/ri';
import type { TMatchResultDto } from '../types/TMatchResultDto';
import { sanitizeBackendKey } from '../util/util';
import './../css/matchCompact.css';
import ReactIcon from './ReactIcon';

export const getCleanTagConfig = (rawTag: string) => {
  const cleanKey = (value: string) =>
    value.replace(/[-\s]/g, '_').toUpperCase();

  if (rawTag.startsWith('SYNERGY_OPPOSITE_')) {
    const rawValue = rawTag.replace('SYNERGY_OPPOSITE_', '');

    return {
      label: `Compatibility.opposites.${cleanKey(rawValue)}`,
      icon:<ReactIcon icon={AiOutlineThunderbolt}/>,
      type: 'opposite',
    };
  }

  if (rawTag.startsWith('LOOKING_FOR_')) {
    return {
      label: `Options.LookingFor.${sanitizeBackendKey(rawTag.replace('LOOKING_FOR_', ''))}`,
      icon: <ReactIcon icon={FiHeart}/>,
      type: 'shared',
    };
  }

  if (rawTag.startsWith('PET_')) {
    return {
      label: `Options.Questions.${sanitizeBackendKey(rawTag.replace('PET_', ''))}`,
      icon: <ReactIcon icon={MdPets}/>,
      type: 'shared',
    };
  }

  if (rawTag.startsWith('EDUCATION_')) {
    return {
      label: `Options.education.${sanitizeBackendKey(rawTag.replace('EDUCATION_', ''))}`,
      icon: <ReactIcon icon={IoSchool}/>,
      type: 'shared',
    };
  }

  if (rawTag.startsWith('DRINKING_')) {
    return {
      label: `Options.drinks.${cleanKey(rawTag.replace('DRINKING_', ''))}`,
      icon:<ReactIcon icon={RiBeerFill}/>,
      type: 'shared',
    };
  }

  if (rawTag.startsWith('SMOKING_')) {
    return {
      label: `Options.Questions.${cleanKey(rawTag.replace('SMOKING_', ''))}`,
      icon: <ReactIcon icon={FaSmoking}/>,
      type: 'shared',
    };
  }

  return {
    label: `Moments.${sanitizeBackendKey(rawTag.trim())}`,
    icon: <ReactIcon icon={FiActivity}/>,
    type: 'moment',
  };
};

interface SynergyCompatibilityProps {
  matchData: TMatchResultDto | null;
  targetUsername: string;
  isLoading: boolean;
  onClose: () => void;
}

const SynergyCompatibility = ({
  matchData,
  targetUsername,
  isLoading,
  onClose,
}: SynergyCompatibilityProps) => {
  const { t } = useTranslation();
  

  if (isLoading || !matchData) {
    return (
      <div className="compatibility-panel compatibility-panel--loading">
        <div className="compatibility-loader">
          <div className="compatibility-loader__ring" />
          <span>
            {t(
              'Compatibility.loading',
              'Discovering what makes you compatible...'
            )}
          </span>
        </div>
      </div>
    );
  }

  const {
    compatibilityScore = 0,
    sharedHobbies = [],
    userAUniqueHobbies = [],
    userBUniqueHobbies = [],
  } = matchData;

  const pureSharedHobbies = sharedHobbies.filter(
    (tag) => !tag.startsWith('SYNERGY_OPPOSITE_')
  );

  const oppositeSynergyTags = sharedHobbies.filter((tag) =>
    tag.startsWith('SYNERGY_OPPOSITE_')
  );

  const renderTag = (
    tag: string,
    variant:
      | 'shared'
      | 'opposite'
      | 'you'
      | 'them'
      | 'moment' = 'shared'
  ) => {
    const { label, icon } = getCleanTagConfig(tag);

    return (
      <div
        key={tag}
        className={`compatibility-tag compatibility-tag--${variant}`}
      >
        <span className="compatibility-tag__icon">{icon}</span>

        <span className="compatibility-tag__text">
          {t(label, tag)}
        </span>
      </div>
    );
  };

  return (
    <div className="compatibility-panel">
      {/* Close */}
      <button
        className="compatibility-panel__close"
        onClick={onClose}
        aria-label={t('Generic.close', 'Close')}
      >
        <FiX />
      </button>

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="compatibility-hero">

        <div className="compatibility-hero__content">
          <h2>
            {t('Compatibility.title')}
          </h2>

          <p>
            {t(
              'Compatibility.description',
              '{{shared}} shared interests and experiences give you a natural place to start.',
              {
                shared: pureSharedHobbies.length,
              }
            )}
          </p>
        </div>

        {/* Score */}
        <div
          className="compatibility-score"
          style={
            {
              '--score': `${compatibilityScore}%`,
            } as React.CSSProperties
          }
        >
          <div className="compatibility-score__inner">
            <strong>{compatibilityScore}%</strong>
            <span>
              {t('Compatibility.compatible', 'Compatible')}
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONNECTION SUMMARY
      ===================================================== */}
      <section className="compatibility-summary">

        <div className="compatibility-summary__item">
          <strong>{pureSharedHobbies.length}</strong>
          <span>
            {t('Compatibility.shared', 'Shared')}
          </span>
        </div>

        <div className="compatibility-summary__line" />

        <div className="compatibility-summary__item">
          <strong>{oppositeSynergyTags.length}</strong>
          <span>
            {t('Compatibility.complementary', 'Complementary')}
          </span>
        </div>

        <div className="compatibility-summary__line" />

        <div className="compatibility-summary__item">
          <strong>
            {userAUniqueHobbies.length + userBUniqueHobbies.length}
          </strong>
          <span>
            {t('Compatibility.unique', 'Unique')}
          </span>
        </div>

      </section>

      {/* =====================================================
          WHAT YOU SHARE
      ===================================================== */}
      {pureSharedHobbies.length > 0 && (
        <section className="compatibility-section compatibility-section--shared">

          <div className="compatibility-section__header">
            <div className="compatibility-section__icon">
              🤝
            </div>

            <div>
              <h3>
                {t(
                  'Compatibility.details_shared',
                  'What you share'
                )}
              </h3>

              <p>
                {t(
                  'Compatibility.shared_description',
                  'These are the interests and values you already have in common.'
                )}
              </p>
            </div>
          </div>

          <div className="compatibility-tags">
            {pureSharedHobbies.map((tag) =>
              renderTag(tag, 'shared')
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          COMPLEMENTARY
      ===================================================== */}
      {oppositeSynergyTags.length > 0 && (
        <section className="compatibility-section compatibility-section--opposite">

          <div className="compatibility-section__header">
            <div className="compatibility-section__icon">
              ⚡
            </div>

            <div>
              <h3>
                {t(
                  'Compatibility.details_opposites_header',
                  'Where you complement each other'
                )}
              </h3>

              <p>
                {t(
                  'Compatibility.opposites_description',
                  'Not everything has to be the same. Some differences can create balance.'
                )}
              </p>
            </div>
          </div>

          <div className="compatibility-tags">
            {oppositeSynergyTags.map((tag) =>
              renderTag(tag, 'opposite')
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          UNIQUE TRAITS
      ===================================================== */}
      {(userAUniqueHobbies.length > 0 ||
        userBUniqueHobbies.length > 0) && (
        <section className="compatibility-section compatibility-section--unique">

          <div className="compatibility-section__header">
            <div className="compatibility-section__icon">
              ✨
            </div>

            <div>
              <h3>
                {t(
                  'Compatibility.details_unique',
                  'What you bring to the connection'
                )}
              </h3>

              <p>
                {t(
                  'Compatibility.unique_description',
                  'These are the things that make each of you different.'
                )}
              </p>
            </div>
          </div>

          <div className="compatibility-people">

            {/* YOU */}
            {userAUniqueHobbies.length > 0 && (
              <div className="compatibility-person compatibility-person--you">

                <div className="compatibility-person__header">
                  <div className="compatibility-person__avatar">
                    👤
                  </div>

                  <div>
                    <span>
                      {t('Compatibility.owner', 'You')}
                    </span>

                    <small>
                      {userAUniqueHobbies.length}{' '}
                      {t(
                        'Compatibility.unique_interests',
                        'unique interests'
                      )}
                    </small>
                  </div>
                </div>

                <div className="compatibility-tags">
                  {userAUniqueHobbies.map((tag) =>
                    renderTag(tag, 'you')
                  )}
                </div>
              </div>
            )}

            {/* Connector */}
            {userAUniqueHobbies.length > 0 &&
              userBUniqueHobbies.length > 0 && (
                <div className="compatibility-person__connector">
                  <FiArrowRight />
                </div>
              )}

            {/* THEM */}
            {userBUniqueHobbies.length > 0 && (
              <div className="compatibility-person compatibility-person--them">

                <div className="compatibility-person__header">
                  <div className="compatibility-person__avatar">
                    ✨
                  </div>

                  <div>
                    <span>{targetUsername}</span>

                    <small>
                      {userBUniqueHobbies.length}{' '}
                      {t(
                        'Compatibility.unique_interests',
                        'unique interests'
                      )}
                    </small>
                  </div>
                </div>

                <div className="compatibility-tags">
                  {userBUniqueHobbies.map((tag) =>
                    renderTag(tag, 'them')
                  )}
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* =====================================================
          FOOTER MESSAGE
      ===================================================== */}
      <div className="compatibility-footer">
        <FiHeart />

        <span>
          {t(
            'Compatibility.footer',
            'The best connections start with something you already share.'
          )}
        </span>
      </div>
    </div>
  );
};

export default SynergyCompatibility;
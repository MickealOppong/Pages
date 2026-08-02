import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiActivity, FiCalendar, FiMapPin, FiSliders, FiUmbrella, FiUser } from 'react-icons/fi';
import { MOMENT_OPTIONS, POLISH_CITIES, sanitizeBackendKey } from '../util/util';
import './../css/DiscoverFilter.scss';



const DiscoveryFilters = () => {

      //get current params
  const url =  new URLSearchParams(location.href.split('?')[1]);

    //translation hook
    const {t} = useTranslation();

    //filter query state
    const [cityFilter,setCityFilter] = useState<string>(url.get('city') as string)
    const [activityFilter,setActivityFilter] = useState<string>(url.get('activity') as string)
    const [ageFilter,setAgeFilter] = useState<{ min: string; max: string }>({ min: url.get('min-age') as string, max: url.get('max-age')as string });
    const [genderFilter,setGenderFilter] = useState<string>(url.get('gender') as string)
    const [lookingForFilter,setLookingForFilter] = useState<string>(url.get('lookingFor') as string)


  const handleReset = () => {
    setCityFilter('');
    setAgeFilter({ min: '18', max: '99' });
    setActivityFilter('');
   setGenderFilter('')
   setLookingForFilter('');
  };

  return (
   <>
    <section className="mvp-filters-panel">
      <div className="filters-center">
        
        {/* Panel Dynamic Heading Row */}
        <div className="filters-page-header">
          <h2><FiSliders />   {t('Options.Header.title')}</h2>
          <button type="button" className="btn-clear-link" onClick={handleReset}>
           {t('Options.Header.Reset_all')}
          </button>
        </div>

        <form className="filters-form-shell" >
          
          {/* Main Discovery Metrics Card */}
          <div className="filters-card">
            <div className="filters-grid-engine">
              
              {/* Filter 1: Regional City Choice Selector Dropdown */}
              <div className="filter-input-group">
                <label><FiMapPin /> {t('Options.Header.Target_location')}</label>
                <select value={cityFilter||''} name='city' onChange={(e) => setCityFilter(e.target.value)}>
                  <option value={''}>Wszystko</option>
                  {POLISH_CITIES.map((city) => (
                    <option key={city} value={city}>{t(`Cities.${sanitizeBackendKey(city)}`)}</option>
                  ))}
                </select>
              </div>

              {/* Filter 2: Shared Activity Selector Dropdown */}
              <div className="filter-input-group">
                <label><FiActivity />{t('Options.Header.Shared_activity')}</label>
                <select value={activityFilter||''} name='activity' onChange={(e) => setActivityFilter(e.target.value)}>
                  <option value="">{t(`Options.Header.all`)}</option>
                  {MOMENT_OPTIONS.map((activity) => (
                    <option key={activity.label} value={activity.label}>{t(`Moments.${sanitizeBackendKey(activity.label)}`)}</option>
                  ))}
                </select>
              </div>
               {/* Filter 3: gender Selector Dropdown */}
              <div className="filter-input-group">
                <label><FiUser/>{t('Options.Header.Gender')}</label>
                <select value={genderFilter||''} name='gender' onChange={(e) => setGenderFilter(e.target.value)}>
                  <option value={''}>{t(`Options.Header.all`)}</option>
                  <option value="Male">{t('Options.Preference.MALE')}</option>
                  <option value="Female">{t('Options.Preference.FEMALE')}</option>
                  <option value="Non-binary">{t('Options.Preference.NON_BINARY')}</option>
                </select>
              </div>
                  {/* Filter 3: gender Selector Dropdown */}
              <div className="filter-input-group">
                <label><FiUmbrella /> {t('Options.Header.Looking_for')}</label>
                <select value={lookingForFilter||''} name='lookingFor' onChange={(e) => setLookingForFilter(e.target.value)}>
                  <option value={''}>{t(`Options.Header.all`)}</option>
                  <option value="Friendship">{t('Options.LookingFor.LONG_TERM')}</option>
                  <option value="Not yet decided">{t('Options.LookingFor.SHORT_TERM')}</option>
                  <option value="Short-term relation">{t('Options.LookingFor.NOT_DECIDED')}</option>
                </select>
              </div>

              {/* Filter 4: Age Range Parameters Field */}
              <div className="filter-input-group full-width-grid-item">
                <label><FiCalendar />{t('Options.Header.Age_limit')}</label>
                <div className="dual-range-inputs-row">
                  <input 
                    type="text" 
                    min="18" 
                    max="99" 
                    name='min-age'
                    value={ageFilter.min||''} 
                    onChange={(e) => setAgeFilter({min:e.target.value,max:ageFilter.max})}
                    placeholder="Min"
                  />
                  <span>to</span>
                  <input 
                    type="text" 
                    min="18" 
                    max="99" 
                    name='max-age'
                    value={ageFilter.max||''} 
                    onChange={(e) => setAgeFilter({max:e.target.value,min:ageFilter.min})}
                    placeholder="Max"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Apply Operations Submission Footer Block */}
          <div className="filters-actions-bar">
            <button type="submit" className="btn-apply-filters">
             {t('Options.Header.filter_btn')}
            </button>
          </div>

        </form>
      </div>
    </section>
   </>
  );
};

export default DiscoveryFilters;

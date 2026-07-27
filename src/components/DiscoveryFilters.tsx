import { useState } from 'react';
import { FiActivity, FiCalendar, FiMapPin, FiSliders, FiUmbrella, FiUser } from 'react-icons/fi';
import { ACTIVITIES_LIST, POLISH_CITIES } from '../util/util';
import './../css/DiscoverFilter.scss';



const DiscoveryFilters = () => {
  /*
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [ageRange, setAgeRange] = useState<{ min: number; max: number }>({ min: 18, max: 35 });
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  */
      //get current params
  const url =  new URLSearchParams(location.href.split('?')[1]);

    //filter query state
    const [cityFilter,setCityFilter] = useState<string>(url.get('city') as string)
    const [activityFilter,setActivityFilter] = useState<string>(url.get('activity') as string)
    const [ageFilter,setAgeFilter] = useState<{ min: number; max: number }>({ min: 18, max: 35 });
    const [genderFilter,setGenderFilter] = useState<string>(url.get('gender') as string)
    const [lookingForFilter,setLookingForFilter] = useState<string>(url.get('lookingFor') as string)


  const handleReset = () => {
    setCityFilter('');
    setAgeFilter({ min: 18, max: 99 });
    setActivityFilter('');
   setGenderFilter('')
   setLookingForFilter('');
  };

  return (
    <section className="mvp-filters-panel">
      <div className="filters-center">
        
        {/* Panel Dynamic Heading Row */}
        <div className="filters-page-header">
          <h2><FiSliders /> Discovery Preferences</h2>
          <button type="button" className="btn-clear-link" onClick={handleReset}>
            Reset All
          </button>
        </div>

        <form className="filters-form-shell" >
          
          {/* Main Discovery Metrics Card */}
          <div className="filters-card">
            <div className="filters-grid-engine">
              
              {/* Filter 1: Regional City Choice Selector Dropdown */}
              <div className="filter-input-group">
                <label><FiMapPin /> Target Location</label>
                <select value={cityFilter||''} name='city' onChange={(e) => setCityFilter(e.target.value)}>
                  <option value="">Any City (Poland)</option>
                  {POLISH_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Filter 2: Shared Activity Selector Dropdown */}
              <div className="filter-input-group">
                <label><FiActivity /> Shared Activity</label>
                <select value={activityFilter||''} name='activity' onChange={(e) => setActivityFilter(e.target.value)}>
                  <option value="">Any Activity</option>
                  {ACTIVITIES_LIST.map((activity) => (
                    <option key={activity} value={activity}>{activity}</option>
                  ))}
                </select>
              </div>
               {/* Filter 3: gender Selector Dropdown */}
              <div className="filter-input-group">
                <label><FiUser/> Gender</label>
                <select value={genderFilter||''} name='gender' onChange={(e) => setGenderFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="Male">Men</option>
                  <option value="Female">Women</option>
                  <option value="Non-binary">Non-binary</option>
                </select>
              </div>
                  {/* Filter 3: gender Selector Dropdown */}
              <div className="filter-input-group">
                <label><FiUmbrella /> Looking For</label>
                <select value={lookingForFilter||''} name='lookingFor' onChange={(e) => setLookingForFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="Long-term relationship">Long term</option>
                  <option value="Friendship">Friendship</option>
                  <option value="Not yet decided">Not yet decided</option>
                  <option value="Short-term relation">Short term</option>
                  <option value="Casual">Casual</option>
                </select>
              </div>

              {/* Filter 4: Age Range Parameters Field */}
              <div className="filter-input-group full-width-grid-item">
                <label><FiCalendar /> Age Limits</label>
                <div className="dual-range-inputs-row">
                  <input 
                    type="number" 
                    min="18" 
                    max="99" 
                    name='min-age'
                    value={ageFilter.min} 
                    onChange={(e) => setAgeFilter(prev => ({ ...prev, min: Math.min(Number(e.target.value), ageFilter.max) }))}
                    placeholder="Min"
                  />
                  <span>to</span>
                  <input 
                    type="number" 
                    min="18" 
                    max="99" 
                    name='max-age'
                    value={ageFilter.max} 
                    onChange={(e) => setAgeFilter(prev => ({ ...prev, max: Math.max(Number(e.target.value), ageFilter.min) }))}
                    placeholder="Max"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Apply Operations Submission Footer Block */}
          <div className="filters-actions-bar">
            <button type="submit" className="btn-apply-filters">
              Apply Filters
            </button>
          </div>

        </form>
      </div>
    </section>
  );
};

export default DiscoveryFilters;

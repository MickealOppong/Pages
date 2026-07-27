
import "./../css/Filters.css";

import { useState, type ChangeEvent } from "react";
import { CiLocationOn } from "react-icons/ci";
import { FiCalendar, FiHome } from "react-icons/fi";
import { LuChevronDown } from "react-icons/lu";
import { ACTIVITIES_LIST, POLISH_CITIES } from "../util/util";

const Filters = ()=>{

    //get current params
  const url =  new URLSearchParams(location.href.split('?')[1]);

    //filter query state
    const [cityFilter,setCityFilter] = useState<string>(url.get('city') as string)
    const [activityFilter,setActivityFilter] = useState<string>(url.get('activity') as string)
    const [ageFilter,setAgeFilter] = useState<string>(url.get('age') as string)
    const [genderFilter,setGenderFilter] = useState<string>(url.get('gender') as string)
  

    
return (
    <form className="filter-form" >
      {/* 1. ACTIVITY SELECTION INPUT */}
      <div className="input-group">
        <FiHome className="input-icon" size={20} aria-hidden="true" />
        <select 
          name="activity" 
          id="filter-activity"
          aria-label="Filter by Activity"
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setActivityFilter(e.target.value)}
          value={activityFilter || ""}
        >
          <option value="">All Activities</option>
          {ACTIVITIES_LIST.map((activity) => (
            <option value={activity} key={activity}>{activity}</option>
          ))}
        </select>
        <LuChevronDown className="chevron-icon" size={16} aria-hidden="true" />
      </div>

      {/* 2. CITY SELECTION INPUT */}
      <div className="input-group">
        <CiLocationOn className="input-icon" size={22} aria-hidden="true" />
        <select 
          name="city" 
          id="filter-city"
          aria-label="Filter by City"
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setCityFilter(e.target.value)}
          value={cityFilter || ""}
        >
          <option value="">All Cities</option>
          {POLISH_CITIES.map((city) => (
            <option value={city} key={city}>{city}</option>
          ))}
        </select>
        <LuChevronDown className="chevron-icon" size={16} aria-hidden="true" />
      </div>

      {/* 3. AGE RANGE SELECTION INPUT */}
      <div className="input-group">
        <FiCalendar className="input-icon" size={20} aria-hidden="true" />
        <select  
          name="age"  
          id="filter-age"
          aria-label="Filter by Age Group"
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setAgeFilter(e.target.value)}
          value={ageFilter || ""}     
        >
          <option value="">All Ages</option>
          <option value="18-24">18-24</option>
          <option value="25-34">25-34</option>
          <option value="35-44">35-44</option>
          <option value="45-54">45-54</option>
          <option value="54-100">54+</option>
        </select>
        <LuChevronDown className="chevron-icon" size={16} aria-hidden="true" />
      </div>

      {/* 4. GENDER SELECTION INPUT */}
      <div className="input-group">
        <FiCalendar className="input-icon" size={20} aria-hidden="true" />
        <select  
          name="gender"  
          id="filter-gender"
          aria-label="Filter by Gender"
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setGenderFilter(e.target.value)}
          value={genderFilter || ""}     
        >
          <option value="">All Genders</option>
          <option value="Male">Men</option>
          <option value="Female">Women</option>
          <option value="Non-binary">Non-binary</option>
        </select>
        <LuChevronDown className="chevron-icon" size={16} aria-hidden="true" />
      </div>

      {/* 5. INTERACTIVE ACTION DISPATCHER */}
      <button type="submit" className="submit-filters-btn">
        Apply Filters
      </button>
    </form>
  );
}
export default Filters
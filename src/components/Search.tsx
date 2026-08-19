import { useState, type ChangeEvent } from "react";



const Search = () => {
  const [searchItem, setSearchItem] = useState<string>("");


  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchItem(inputValue); // Keep your text state in sync

  };

  return (
     <div className="filter-input-group ">
        <input
          type="text"
          name="city"
          id="search"
          value={searchItem} // Explicit controlled input binding
          onChange={handleSearchInput}
          autoComplete="address-level2"
          placeholder="Type a city name..."
          className="search-input"
        />
      </div>
  );
};

export default Search;

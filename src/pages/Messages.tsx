import { useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";
import { Link, useLoaderData } from "react-router-dom";
import type { Store } from "redux";
import MatchList from "../components/MatchList";
import { transApi } from "../features/api/transApi";
import type { AppDispatch, RootState } from "../store";
import type { TLikes } from "../types/TLikes";
import './../css/Messages.css';

export const loader =(store:Store<RootState>)=>async ()=>{

    const userId = store.getState().userSlice.id;


    const dispatch = store.dispatch as AppDispatch;

    const promise= await dispatch(transApi.endpoints.myMatches.initiate(userId,{forceRefetch:true})).unwrap();
          
     
    const data:TLikes  = promise as TLikes;

    return data;
}



const Messages = () => {
  // 1. Maintain source data
  const data = useLoaderData() as TLikes[];    
  
  // 2. Track search inputs
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };    

  // 3. Dynamically filter list items
  const filteredMatchData = data ? data.filter((item) => 
    item.firstName.toLowerCase().includes(searchQuery)
  ) : [];

    //translation hook
  const {t} = useTranslation();

  // 4. Global Guard: Fixed structural execution order to avoid runtime crashes
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <div className="empty-icon">💔</div>
          <h3>{t('message_Dialog.title')}</h3>
          <p>{t('message_Dialog.Message')}</p>
          <Link to={'/landing'} className="discover-btn">{t('message_Dialog.btn')}</Link>
        </div>
      </div>
    );
  }


  
  return (
    <section className="messages">
      <div className="messages-center">     
          <div className="header-container">
            <div className="header">
              <h2>{t('Messages.title')}</h2>
            </div>
            <div className="search-container">
              <FiSearch />
              <input 
                type="text" 
                name="search" 
                placeholder={t('Messages.search_placeholder')}
                value={searchQuery} // Component is now fully controlled
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="match-section">
            {/* Inline search fallback: user gets feedback if search yields 0 items */}
            {filteredMatchData.length === 0 ? (
              <p className="no-results">{t('Messages.search_result')}{" "}{searchQuery}</p>
            ) : (
              <MatchList data={filteredMatchData} />
            )}
          </div>
      </div>
    </section>
  );

}

export default Messages;

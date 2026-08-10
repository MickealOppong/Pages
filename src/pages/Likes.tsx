import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiHeart } from "react-icons/fi";
import { Link, useLoaderData } from "react-router-dom";
import type { Store } from "redux";
import { CardContainer } from "../components";
import MatchCardContainer from "../components/MatchCardContainer";
import { transApi } from "../features/api/transApi";
import type { AppDispatch, RootState } from "../store";
import type { TLikes } from "../types/TLikes";
import type { TMatchDto } from "../types/TMatchDto";
import './../css/likes.css';

export const loader =(store:Store<RootState>)=>async ()=>{

    const userId = store.getState().userSlice.id;


    const dispatch = store.dispatch as AppDispatch;

    const promise_one= await dispatch(transApi.endpoints.myLikes.initiate(userId,{forceRefetch:true}));
    const promise_two= await dispatch(transApi.endpoints.myMatches.initiate(userId,{forceRefetch:true}));
         
     
    const pending:TLikes  = promise_one.data as TLikes;
    const accepted:TLikes  = promise_two.data as TLikes;
        
        const dto={ pending,accepted}
    return dto ||[];
}

const Likes = ()=>{
    const { pending,accepted}= useLoaderData() as TMatchDto

    

    //tab switch on handler
    const[tabSelected,setTabSelected]=useState<string>(localStorage.getItem('tab')||'');


    //translation hook
  const {t} = useTranslation();



    const handleTabClick =(tab:string)=>{
        setTabSelected(()=>tab)
        localStorage.setItem('tab',tab)
    }

     if ((pending.length===0 && accepted.length===0)) {
      return (
        <div className="empty-state">
          <div className="empty-card">
            <div className="empty-icon">💔</div>
            <h3>{t('match_Dialog.title')}</h3>
            <p>{t('match_Dialog.Message')}</p>
          <Link to={'/landing'} className="discover-btn">{t('match_Dialog.btn')}</Link>
          </div>
        </div>
      );
    } 
    
    
    return <section className="likes">
            <div className="likes-header">
              <div className="header-center">
                 <div className="header">
                 <h2> {t('Matches.ConnectionsPage.title')}</h2>
                <FiHeart/>
               </div>
                <div className="tabs">
                     <div className="tab">
                        <button onClick={()=>handleTabClick('like')}><span>{t('Matches.ConnectionsPage.tabs.interests_received')}</span></button>
                        <div className={`${tabSelected=='like'?'underline active':'underline'}`}></div>
                     </div>
                      <div className="tab">
                        <button onClick={()=>handleTabClick('match')}><span>{t('Matches.ConnectionsPage.tabs.matches')}</span></button> 
                        <div className={`${tabSelected=='match'?'underline active':'underline '}`}></div>
                    </div>   
                </div>
              </div>
            </div>
             <div>
                      
            </div>

            <section>
                {
                    tabSelected==='like'?<CardContainer likes={pending}/>:
                    <MatchCardContainer likes={accepted}/>
                }
            </section>
    </section>
}
export default Likes
import { useState, type SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { FaPeopleArrows } from "react-icons/fa";
import { Link, useRevalidator } from "react-router-dom";
import { useAcceptLikeByIdMutation, useRemoveLikeMutation } from "../features/api/transApi";
import { useMarkNotifAsReadMutation } from "../features/api/userApi";
import { useAppSelector } from "../store";
import type { TLikes } from "../types/TLikes";
import { formatLastSentDate, getAgeFromDateOfBirth, sanitizeBackendKey } from "../util/util";
import defImage from './../assets/default.jpeg';
import './../css/Card.css';

const Card = ({data}:{data:TLikes})=>{

   const{ revalidate }= useRevalidator()    
    const [isFolding, setIsFolding] = useState<Boolean>(false);
   
    //translation hook
    const {t} = useTranslation();
    
    //current user id
    const currentUserId = useAppSelector((state)=>state.userSlice.id);

    //delete like hook
    const [deleteLike]=useRemoveLikeMutation()
    
    //update like to natch hook
    const [acceptLikeRequestById] = useAcceptLikeByIdMutation()


      //notification read
      const [updateNotif] = useMarkNotifAsReadMutation()
  
      const fireNotification =()=>{
        updateNotif({targetId:data.matchId,type:'like',recipient:currentUserId})
      }
  


      

  const handlePass = async (e:SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFolding(true);
    
      const re= await deleteLikeRequest(data.matchId);
    console.log(re);

    // Wait for the SCSS paper-fold animation to finish before removing from state/DB
    setTimeout(() => {
    //const re=  deleteLikeRequest(data.matchId);
    console.log(re);
    
    }, 600); 
  };
 

    //remove like
    const deleteLikeRequest = async(id:number)=>{     

        try {
            const response = await deleteLike(id)
            if(response.data){
              fireNotification()
                revalidate()
                
            }
            
        } catch (error) {
            
        }
    }   
    
    
    async function handleAcceptMatchRequest(matchId: number, currentUserId: number) {

        
        try {
            const response = await acceptLikeRequestById({matchId,currentUserId});
              if(response.data){
                fireNotification()
                revalidate()
            }
            
        } catch (error) {
            
        }
    }

   


  return (
    <article className={`single-like-card ${isFolding ? 'fold-out' : ''}`}>
      <Link to={`/landing/view/${data.senderId}`} className="card-profile-link">
        
        <div className="card-main-body">
          <div className="img-wrapper">
            <img src={data.image || defImage} alt={`${data.firstName}'s profile`} />
          </div>
          
          <div className="info-wrapper">
            <h2>
              {data.firstName}, {getAgeFromDateOfBirth(data.date_of_birth)}
            </h2>
            <div className="activity-badge">
              <FaPeopleArrows className="icon" />
              <span>{t('Matches.ConnectionsPage.card1.connected_via')}{" "}{t(`Moments.${sanitizeBackendKey(data.activity)}`)}</span>
            </div>
          </div>

          <div className="timestamp">
            {formatLastSentDate(data.requestDate)}
          </div>
        </div>

        <div className="action-button-group">
          <button className="btn-reject" onClick={handlePass}>
            {t('Matches.ConnectionsPage.card1.actions.pass')}
          </button>
          
          <button 
            className="btn-accept" 
            onClick={(e) => { 
              e.preventDefault(); 
              e.stopPropagation();
              handleAcceptMatchRequest(data.matchId, currentUserId); 
            }}
          >
    {t('Matches.ConnectionsPage.card1.actions.accept')}
          </button>
        </div>

      </Link>
    </article>
  );

}
export default Card
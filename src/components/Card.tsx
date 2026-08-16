import { useState, type SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { FaPeopleArrows } from "react-icons/fa";
import { FiBarChart, FiHeart } from "react-icons/fi";
import { LiaTimesSolid } from "react-icons/lia";
import { useRevalidator } from "react-router-dom";
import { useAcceptLikeByIdMutation, useLazyGetCompatibilityQuery, useRemoveLikeMutation } from "../features/api/transApi";
import { useMarkNotifAsReadMutation } from "../features/api/userApi";
import { useAppSelector } from "../store";
import type { TLikes } from "../types/TLikes";
import type { TMatchResultDto } from "../types/TMatchResultDto";
import { formatLastSentDate, getAgeFromDateOfBirth, sanitizeBackendKey } from "../util/util";
import defImage from './../assets/default.jpeg';
import './../css/Card.css';
import SynergyCompatibility from "./SynergyCompatibility";

const Card = ({ data }: { data: TLikes }) => {

  //locale for date trqnslation
  const locale = localStorage.getItem('i18nextLng') as string

  const { revalidate } = useRevalidator();    
  const [isFolding, setIsFolding] = useState<Boolean>(false);
  const [showChart, setShowChart] = useState<boolean>(false);
   
  const { t } = useTranslation();
  const currentUserId = useAppSelector((state) => state.userSlice.id);

  const [deleteLike] = useRemoveLikeMutation();
  const [getCompatibility, { isLoading: isChartLoading }] = useLazyGetCompatibilityQuery();
  const [matchData, setMatchData] = useState<TMatchResultDto | null>(null);
    
  const [acceptLikeRequestById] = useAcceptLikeByIdMutation();
  const [updateNotif] = useMarkNotifAsReadMutation();
  
  const fireNotification = () => {
    updateNotif({ targetId: data.matchId, type: 'like', recipient: currentUserId });
  };

  // Triggers compatibility lazily only when requested by a card tap action click
  const handleOpenCompatibility = async () => {
    setShowChart(true);
    if (!matchData) {
      try {
        const response = await getCompatibility({ userA: currentUserId, userB: data.senderId }).unwrap();
        setMatchData(response);
      } catch (err) {
        console.error("Failed loading match chart metrics:", err);
      }
    }
  };

  const handlePass = async (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFolding(true);
    await deleteLikeRequest(data.matchId);
  };

  const deleteLikeRequest = async (id: number) => {     
    try {
      const response = await deleteLike(id);
      if (response.data) {
        fireNotification();
        revalidate();
      }
    } catch (error) {
      console.error(error);
    }
  };   
    
  const handleAcceptMatchRequest = async (matchId: number, userId: number) => {
    try {
      const response = await acceptLikeRequestById({ matchId, currentUserId: userId });
      if (response.data) {
        fireNotification();
        revalidate();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Slide-Up Bottom Overlay Sheet Display Layer Mask */}
      {showChart && (
        <div className="compatibility-backdrop-blur" onClick={() => setShowChart(false)}>
          <div className="sheet-positioning-container" onClick={(e) => e.stopPropagation()}>
            <SynergyCompatibility 
              matchData={matchData as TMatchResultDto} 
              targetUsername={data.firstName as string} 
              isLoading={isChartLoading}
              onClose={() => setShowChart(false)}
            />
          </div>
        </div>
      )}

      <article className={`single-like-card ${isFolding ? 'fold-out' : ''}`}>
        <div className="card-profile-link">
          
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
                <span>
                  {t('Matches.ConnectionsPage.card1.connected_via')}{" "}
                  {t(`Moments.${sanitizeBackendKey(data.activity)}`)}
                </span>
              </div>
            </div>

            <div className="timestamp">
              {formatLastSentDate(data.requestDate,locale)}
            </div>
          </div>

          <div className="action-button-group">
            {/* The Specific Compatibility View Controller Action Trigger */}
           <button className="btn-compatibility-trigger" onClick={handleOpenCompatibility}>
             <FiBarChart className="report-btn" />
            <span >
               {t('Matches.ConnectionsPage.card1.actions.compatibility')}
            </span>
           </button>
            
            <button className="reject-container" onClick={handlePass}>
              <LiaTimesSolid className="reject-btn" />
              <span  >
              {t('Matches.ConnectionsPage.card1.actions.pass')}
            </span>
            </button>
            
           <button className="accept-container" onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation();
                handleAcceptMatchRequest(data.matchId, currentUserId); 
              }}>
            <FiHeart className="accept-btn"  />
            <span>{t('Matches.ConnectionsPage.card1.actions.accept')}</span>
           </button>
          </div>

        </div>
      </article>
    </>
  );
};

export default Card;

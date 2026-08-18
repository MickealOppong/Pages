import React from "react";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import { FaRuler } from "react-icons/fa";
import { FiBriefcase, FiEye, FiHeart, FiMapPin } from "react-icons/fi";
import { RiHeart2Fill } from "react-icons/ri";
import { useUpdateReachMutation } from "../features/api/transApi";
import type { TPostList } from "../types/TPostList";
import { MOMENT_OPTIONS, sanitizeBackendKey, type ActivityType } from "../util/util";
import defImage from './../assets/default.jpeg';
import './../css/DiscoverCard.css';
import ReactIcon from "./ReactIcon";
import VideoPlayer from "./VideoPlayer";

interface DiscoverCardProps {
    layout: "portrait" | "landscape";
    post: TPostList;
    senderId: number;
    isVideo: boolean;
    getAgeFromDateOfBirth: (date: string ) => number
    handleInterestedFunc: (
        senderId: number,
        userId: number,
        postId: number,
        requestReceived: boolean
    ) => void;
    handleViewProfileFunc: (id:number,postId:number) => void;
    getDynamicColours: (type: ActivityType) => {
        background: string,
        color: string;
    };
}



const DiscoverCard: React.FC<DiscoverCardProps> = ({
    layout,
    post,
    senderId,
    isVideo,
    getAgeFromDateOfBirth,
    handleInterestedFunc,
    handleViewProfileFunc,
    getDynamicColours}) => {
       

    const badge = getDynamicColours(post.type as ActivityType);

    //update reach count when card click
    const [updateReach] = useUpdateReachMutation()


    //translation hook
    const {t} = useTranslation();
    
    

    return <article className={`discover-card ${layout}`} >

    <div className={`discover-card__discoverMedia ${layout}`}>
      

        {isVideo ? (
            <VideoPlayer
                src={post.media}
                poster=""
                view={post.mediaOrientation}
            />
        ) : (
            <img
                src={post.media}
                className="media-cover-img"
                alt=""
            />
        )}
          

    </div>
     
        <div className="discover-card__mainOverlay" >

            <header className="profile-header">

                <img src={post.profileImage || defImage} className="avatar" alt=""/>

                <div className="profile-container">

                   <div className="profile-info">
                     <h3>
                        {post.firstName},
                        {getAgeFromDateOfBirth(post.date_of_birth)}
                    </h3>

                    <span>
                        <FiMapPin/>
                       {t(`Cities.${sanitizeBackendKey(post.location)}`)}
                    </span>
                   </div>
                    <div className="tags_outer">

                            <span
                                className="activity-tag"
                                style={{
                                    background: badge.background,
                                    color: badge.color
                                }}
                            >
                                <ReactIcon icon={ MOMENT_OPTIONS.find((moment)=>moment.label===post.type)?.icon as IconType}/>
                               {t(`Moments.${sanitizeBackendKey(post.type)}`)}
                            </span>

                            {post.lookingFor &&
                                <span className="goal-badge">
                                    <RiHeart2Fill/>
                                     {t(`Options.LookingFor.${sanitizeBackendKey(post?.lookingFor)}`)}
                                </span>
                            }

                   </div>
                </div>
             </header>

       <div className="discover-card_target" >
                        <div className="tags">

                           {
                            post.height &&
                             <span className="activity-tag">
                                <FaRuler/>
                                {`${post.height} cm`}
                            </span>
                           }

                            {post.profession &&
                                <span className="goal-badge">
                                    <FiBriefcase/>
                                   {t(`Professions.${sanitizeBackendKey(post.profession)}`)}
                                </span>
                            }

                        </div>

                      <div className="content">
                          <p >

                            {post.content}

                        </p>
                      </div>

                        <footer className="discover-footer">
                            <div className="discover-footer_actions" >
        
                            <button className="secondary-action"   onClick={() =>{
                                     handleViewProfileFunc(post.userId,post.postId)
                                     updateReach(post.postId)
                                     } }>

                                <FiEye />

                                <span>{t("CTA.View")} </span>

                            </button>

                            <button className="primary-action"    onClick={() =>{
                                      handleInterestedFunc(
                                            senderId,
                                            post.userId,
                                            post.postId,
                                            post.requestReceived
                                        )
                                    }
                                     }>

                                <FiHeart />
                                 <div>
                                    <strong> {t("CTA.Spotkac")}  </strong>

                                    <small>  {t("CTA.Info")}  </small>
                                 </div>

                            </button>

                              </div>
                                <div className="discover-footer_brand">

                                <span className="discover-footer-brand_icon">
                                    ✓
                                </span>

                                <span>
                                   {t('CTA.Message_brand')} {t('CTA.Message')}
                                </span>

                                </div>

                         </footer>
                    </div>
           

        </div>

</article>

};

export default DiscoverCard;
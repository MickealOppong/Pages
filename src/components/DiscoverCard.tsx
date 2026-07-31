import React from "react";
import type { IconType } from "react-icons";
import { FaRuler } from "react-icons/fa";
import { FiBriefcase, FiEye, FiHeart, FiMapPin } from "react-icons/fi";
import { RiHeart2Fill } from "react-icons/ri";
import { useUpdateReachMutation } from "../features/api/transApi";
import type { TPostList } from "../types/TPostList";
import { MOMENT_OPTIONS, type ActivityType } from "../util/util";
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
    handleViewProfileFunc: (userId: number) => void;
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


    
    

    return <article className={`discover-card ${layout}`} >

    <div className="discover-card__media">
         <div className="discover-card_actions">

                            <button className="secondary-action"   onClick={() =>{
                                     handleViewProfileFunc(post.userId)
                                     updateReach(post.postId)
                                     } }>

                                <FiEye />

                               Zobacz

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
                                Spotkaj

                            </button>

                        </div>

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
                        {post.location}
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
                               {post.type}
                            </span>

                            {post.lookingFor &&
                                <span className="goal-badge">
                                    <RiHeart2Fill/>
                                  {post?.lookingFor.substring(0,10)}
                                </span>
                            }

                   </div>
                </div>
             </header>

              {/* Wrap the hidden items inside this selector node right beneath the header */}
         <div className="discover-card-drawer-target"  >

                <div className="discover-card-drawer-inner" >
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
                                    {post.profession}
                                </span>
                            }

                        </div>

                        <p className="story">

                            {post.content}

                        </p>

                        <footer style={{display:'none'}}>

                            <button className="btn-secondary"   onClick={() =>{
                                     handleViewProfileFunc(post.userId)
                                     updateReach(post.postId)
                                     } }>

                                <FiEye />

                                Profile

                            </button>

                            <button className="btn-primary"    onClick={() =>{
                                      handleInterestedFunc(
                                            senderId,
                                            post.userId,
                                            post.postId,
                                            post.requestReceived
                                        )
                                    }
                                     }>

                                <FiHeart/>

                                let's connect

                            </button>

                        </footer>
                    </div>
           
          </div>
           

        </div>

</article>

};

export default DiscoverCard;
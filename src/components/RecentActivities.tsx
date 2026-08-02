import { useTranslation } from "react-i18next";
import type { TUserPost } from "../types/TUserPost";
import { sanitizeBackendKey } from "../util/util";
import './../css/RecentActivities.css';
import VideoPlayer from "./VideoPlayer";


const RecentActivities = ({activities}:{activities:TUserPost[]}) => {
console.log(activities);


  //translation hook
  const {t} = useTranslation();

    return (
        <section className="recent_activities">

          <div className="section_center">
              <div className="sectionHeader">
                <h2>{t('Recent_Activities.title')}</h2>
                <span>{activities?.length} {t('Recent_Activities.Activities')}</span>
            </div>
          <div className="activities">

                {activities.map((activity )=>  {

                     const isVideo = activity.media?.toLowerCase().endsWith('.mp4') || 
                                    activity.media?.toLowerCase().endsWith('.mov') || 
                                    activity.media?.toLowerCase().endsWith('.webm'); 

                    return   <article
                        key={activity.postId}
                        className={`activityCard ${activity.visibility.toLowerCase()!=='public' && !activity.viewAllowed?'blur':''}`}
                    >

                    {/* Media */}
                    <div className={`media-wrapper ${activity.mediaOrientation}`}>

                      {isVideo ? (
                        <VideoPlayer src={activity.media} view={activity.mediaOrientation} poster=""/>
                      ) : (
                        <img
                          src={activity.media}
                          alt=""
                          className="post-media"
                        />
                      )}

                    </div>              
                        <div className="activityContent">

                            <div className="activityHeader">

                                <span className="tag">
                                    {t(`Moments.${sanitizeBackendKey(activity.type)}`)}
                                </span>

                            </div>

                            <p>
                                {activity.content}
                            </p>

                

                        </div>
                    </article>
                }                   
                  
                )}

            </div>
          </div>
        </section>
    );
};

export default RecentActivities;


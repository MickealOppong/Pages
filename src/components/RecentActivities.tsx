import type { TUserPost } from "../types/TUserPost";
import './../css/RecentActivities.css';


const RecentActivities = ({activities}:{activities:TUserPost[]}) => {




    return (
        <section className="recent_activities">

          <div className="section_center">
              <div className="sectionHeader">
                <h2>Recent Activities</h2>
                <span>{activities?.length} Activities</span>
            </div>
          <div className="activities">

                {activities.map((activity )=>  {

                     const isVideo = activity.image?.toLowerCase().endsWith('.mp4') || 
                                    activity.image?.toLowerCase().endsWith('.mov') || 
                                    activity.image?.toLowerCase().endsWith('.webm'); 

                    return   <article
                        key={activity.postId}
                        className={`activityCard ${activity.visibility.toLowerCase()!=='public' && !activity.viewAllowed?'blur':''}`}
                    >

                    {/* Media */}
  <div className="media-wrapper">

    {isVideo ? (
      <>
        <video
          src={activity.image}
          controls
          className="post-media"
          playsInline
        />

        <span className="video-duration" style={{display:'none'}}>
          8 sec
        </span>
      </>
    ) : (
      <img
        src={activity.image}
        alt=""
        className="post-media"
      />
    )}

  </div>
     

                        <div className="activityContent">

                            <div className="activityHeader">

                                <span className="tag">
                                    {activity.type}
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


import { FiActivity, FiEye, FiHeart, FiMapPin } from 'react-icons/fi';
import type { TPostList } from '../types/TPostList';
import type { ActivityColor, ActivityType } from '../util/util';
import './../css/PorttraitView.css';
import VideoPlayer from './VideoPlayer'; // 

const PortraitView =({ post,isVideo, getAgeFromDateOfBirth, getDynamicColours, handleViewProfileFunc ,handleInterestedFunc, senderId }:{ post:TPostList, isVideo:boolean, getAgeFromDateOfBirth:(input:string)=>number, getDynamicColours:(input:ActivityType)=>ActivityColor, handleViewProfileFunc:(input:number)=>void, 
    handleInterestedFunc:(senderId:number, userId:number, postId:number, requestReceived:boolean)=>Promise<void>, senderId:number })=> {
 const badgeStyles = getDynamicColours(post.type as ActivityType);
 return (
    <article className="dating-card-portrait" aria-label={`${post.firstName}'s discovery profile`}>
      {/* 1. IMMERSIVE MEDIA VIEWPORT BLOCK */}
      <div className="card-portrait__media">
        {post.lookingFor && (
          <div className="relationship-goal-badge">
            <span role="img" aria-label="Heart icon">❤️</span> {post.lookingFor.substring(0, 10)}
          </div>
        )}
        
        {isVideo ? (
          <div className="media-contain-box">
            {/* The focus API tracks orientation mappings cleanly using the view parameter */}
            <VideoPlayer 
              src={post.media} 
              poster="" 
              view={post.mediaOrientation} 
            />
          </div>
        ) : (
          <img 
            src={post.media} 
            className="media-cover-img" 
            alt={`${post.firstName}'s uploaded presentation media`} 
            loading="lazy"
          />
        )}
      </div>

      {/* 2. PROFILE METADATA & ICEBREAKER DETAILS PANEL */}
      <div className="card-portrait__content">
        <header className="user-profile-header">
          <div className="mini-avatar">
            <img 
              src={post.profileImage} 
              alt={`${post.firstName}'s small profile avatar avatar`} 
            />
          </div>
          <div className="user-meta">
            <h3>
              {post.firstName}, {getAgeFromDateOfBirth(post.date_of_birth)}
            </h3>
            <span className="geo-location" aria-label={`Location: ${post.location}`}>
              <FiMapPin aria-hidden="true" /> 
              <span>{post.location}</span>
            </span>
          </div>
        </header>

        <div className="card-portrait__body">
          {/* Replaced inline styles with a dynamic CSS property hook injection */}
          <span 
            className="activity-tag" 
            style={{ 
              '--badge-bg': badgeStyles.background, 
              '--badge-color': badgeStyles.color 
            } as React.CSSProperties}
          >
            <FiActivity aria-hidden="true" /> 
            <span>{post.type}</span>
          </span>
          
          {post.content && (
            <p className="story-snippet">
              {post.content}
            </p>
          )}
        </div>

        {/* 3. CORE CALL TO ACTION DECK ENGINE BUTTONS */}
        <footer className="card-portrait__actions">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => handleViewProfileFunc(post.userId)}
          >
            <FiEye aria-hidden="true" /> 
          </button>
          
          <button 
            type="button" 
            className="btn-primary" 
            onClick={() => handleInterestedFunc(senderId, post.userId, post.postId, post.requestReceived)}
          >
            <FiHeart aria-hidden="true" />  
          </button>
        </footer>
      </div>
    </article>
  );
}
export default PortraitView
import { FiActivity, FiEye, FiHeart, FiMapPin } from 'react-icons/fi';
import type { TPostList } from '../types/TPostList';
import type { ActivityColor, ActivityType } from '../util/util';
import './../css/landscapeView.css';
import VideoPlayer from './VideoPlayer'; // Uses our focus tracking video logic
const LandscapeView =({ post, isVideo,getAgeFromDateOfBirth, getDynamicColours, handleViewProfileFunc, handleInterestedFunc, senderId }:{ post:TPostList,isVideo:boolean, getAgeFromDateOfBirth:(input:string)=>number, getDynamicColours:(input:ActivityType)=>ActivityColor, handleViewProfileFunc:(input:number)=>void, handleInterestedFunc:(senderId:number, userId:number, postId:number, requestReceived:boolean)=>void, senderId:number })=> {

 return (
    <article className="dating-card-landscape">
      {/* Left Media Deck Panel */}
        <div className='dating-card-parent'>
           <div className="card-landscape__hero">
        {isVideo ? (
          <div className="media-contain-box">
            <VideoPlayer src={post.media} poster="" view={post.mediaOrientation}/>
          </div>
        ) : (
          <img src={post.media} className="media-cover-img" alt={`${post.firstName}'s preview`} />
        )}
        {/** Profile position on Hero image or video */}
          <div className="user-profile-header">
          <div className="mini-avatar">
            <img src={post.profileImage} alt="" />
          </div>
          <div className="user-meta">
            <h3>{post.firstName}, {getAgeFromDateOfBirth(post.date_of_birth)}</h3>
            <span className="geo-location"><FiMapPin /> {post.location}</span>
          </div>
        </div>
      </div>

      {/* Right Content Engine Info Panel */}
      <div className="card-landscape__content">

        <div className="card-landscape__body">
          <div className="badge-row">
            {post.lookingFor && <div className="relationship-goal-badge-inline">❤️ {post.lookingFor.substring(0, 10)}</div>}
            <span className="activity-tag" style={{ background: getDynamicColours(post.type as ActivityType).background, color: getDynamicColours(post.type as ActivityType).color }}>
              <FiActivity /> {post.type}
            </span>
          </div>
          <div className='card-caption-container'>
            {post.content && <p className="story-snippet-wide">{post.content}</p>}
          </div>
        </div>

        <div className="card-landscape__actions">
          <button type="button" className="btn-secondary" onClick={() => handleViewProfileFunc(post.userId)}>
            <FiEye size={24} /> Wiecej o mnie
          </button>
          <button type="button" className="btn-primary" onClick={() => handleInterestedFunc(senderId, post.userId, post.postId, post.requestReceived)}>
            <FiHeart size={24} /> Make a move
          </button>
        </div>
      </div>
        </div>
    </article>
  );
}
export default LandscapeView
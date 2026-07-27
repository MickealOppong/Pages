import { FiBriefcase, FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getAgeFromDateOfBirth } from '../util/util';


const Person = ({userId,image,firstName, date_of_birth,profession}:{userId:number,image:string,firstName:string, date_of_birth:string,profession?:string}) => {

  // Prevents the CTA click from drilling into two separate routes simultaneously
  const handleCtaClick = () => {
    
  };

  return  <Link to={`/landing/view/${userId}`} className="move-card-link-wrapper">
      <article className="move-interactive-card">
        
  
        <div className="move-card-media-box">
          <img src={image} alt={`${firstName}'s profile snapshot`} className="move-card-photo" />
          
 
          <div className="move-card-scrim-overlay" />
        </div>


        <div className="move-card-body-content">
          
            <h3 className="move-user-name">{firstName},</h3>
            <span className="move-user-age">{getAgeFromDateOfBirth(date_of_birth)}</span>
         

          <div className="move-profile-profession-line">
            <FiBriefcase size={14} className="profession-icon" />
            <span className="move-user-job">{profession || 'Independent'}</span>
          </div>
          <button  type="button" className="move-cta-action-btn" onClick={handleCtaClick}>
            <FiHeart size={16} fill="currentColor" />
            <span>Make a move</span>
          </button>
         </div>

      </article>
    </Link>

};

export default Person;

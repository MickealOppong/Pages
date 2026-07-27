import { Link } from "react-router-dom";
import type { TLikes } from "../types/TLikes";
import { getAgeFromDateOfBirth } from "../util/util";
import defImage from './../assets/default.jpeg';
import './../css/Card.css';
const MatchCard = ({data}:{data:TLikes})=>{    


     return (
    <div className="single-match-card">
      {/* The entire card acts as a single target leading straight to the chat view */}
      <Link to={`/landing/messages/chat/${data.matchId}`} className="match-card-chat-link">
        
        {/* Profile Avatar Graphic Container */}
        <div className="img-content">
          <img src={data.image||defImage}  />
        </div>
        
        {/* User Identity Details & Navigation Call to Action */}
        <div className="info-content">
          <h2>
            {data.firstName}, {getAgeFromDateOfBirth(data.date_of_birth)}
          </h2>
          <p>Click to open chat...</p>
        </div>

      </Link>
    </div>
  );
}
export default MatchCard
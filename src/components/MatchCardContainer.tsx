import type { TLikes } from "../types/TLikes";
import './../css/Match.css';
import MatchCard from "./MatchCard";


const MatchCardContainer =({likes}:{likes:TLikes[]})=>{

  
    return <section className="matches">        
          <div className="match-center">
              <div className="matches-content">
                {
                    likes.map((like)=>{
                        return <MatchCard data={like} key={like.matchId}/>
                    })
                }
            </div>
          </div>
    </section>
}

export default MatchCardContainer
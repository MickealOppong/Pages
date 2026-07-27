import type { TLikes } from "../types/TLikes";
import './../css/Card.css';
import Card from "./Card";


const LikesContainer =({likes}:{likes:TLikes[]})=>{

  
    return <section className="likes">        
            <div className="likes-content">
                {
                    likes.map((like)=>{
                        return <Card data={like} key={like.matchId}/>
                    })
                }
            </div>
    </section>
}

export default LikesContainer
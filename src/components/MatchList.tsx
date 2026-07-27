import type { TLikes } from "../types/TLikes";
import Match from "./Match";

const MatchList = ({data}:{data:TLikes[]})=>{
 // Store the currently selected MATCH ID in state


 return (
    <section className="list-center">
      <div className="matches">
        {data.map((match) => (
          <Match 
            {...match} 
            key={match.matchId} />
        ))}
      </div>
    </section>
  );
}
export default MatchList
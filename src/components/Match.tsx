import { Link } from "react-router-dom";
import { useMarkNotifAsReadMutation } from "../features/api/userApi";
import { useAppSelector } from "../store";
import { formatLastSentDate } from "../util/util";
import defImage from './../assets/default.jpeg';
   

const Match = ({matchId,image, firstName,lastName,lastMessageDate,lastMessage,online}:{matchId:number,image:string,lastMessageDate:Date,firstName:string,lastName:string,lastMessage:string,online:boolean})=>{

  const id = useAppSelector((state)=>state.userSlice.id)

  //notification read
     const [updateNotif] = useMarkNotifAsReadMutation()

        const handleLinkClick =async()=>{
             
        await updateNotif({targetId:matchId,type:'message',recipient:id})
       }
   

 return (
    <Link 
      to={`/landing/chat/${matchId}`}  
      className={ `link `}
     onClick={()=>handleLinkClick()}>
        
          {/* MOBILE PROFILE TEMPLATE */}
          <div className="small-screen">
            <div className={`img-container`}>
              <img src={image || defImage} alt={`${firstName} profile`} />
              <div className={online ? 'online' : 'not_online'}></div>
            </div>
            <div className="name-container">
              <p>{firstName}</p>
            </div>
          </div>

          {/* DESKTOP SIDEBAR ROW LAYOUT */}
          <div className="large-screen">
            <div className={`large_screen_center`}>
              <div className="img-container">
                <img src={image || defImage} />
                <div className={online ? 'large_online' : 'large_not_online'}></div>
              </div>
              
              <div className="name-container">
                <h2>{`${firstName} ${lastName}`.trim() || 'Anonymous'}</h2>
                <p className={`${online?'read':'not_read'}`}>{lastMessage}</p>
              </div>

              <div className="date-meta-container">
                <div className="date-container">
                  <span>{formatLastSentDate(lastMessageDate)}</span>
                </div>
        
              </div>
            </div>
          </div>
    </Link>
  );
}

export default Match
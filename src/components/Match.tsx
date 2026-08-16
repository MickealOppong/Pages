import { Link } from "react-router-dom";
import { useMarkNotifAsReadMutation } from "../features/api/userApi";
import { useAppSelector } from "../store";
import { formatLastSentDate } from "../util/util";
import defImage from './../assets/default.jpeg';
   

const Match = ({matchId,image, firstName,lastMessageDate,lastMessage,online}:{matchId:number,image:string,lastMessageDate:Date,firstName:string,lastMessage:string,online:boolean})=>{

  const id = useAppSelector((state)=>state.userSlice.id)
  //locale for date trqnslation
  const locale = localStorage.getItem('i18nextLng') as string
  //notification read
     const [updateNotif] = useMarkNotifAsReadMutation()

        const handleLinkClick =async()=>{
             
        await updateNotif({targetId:matchId,type:'message',recipient:id})
       }
   

 return (
    <Link 
      to={`/landing/chat/${matchId}`}  
      className={ `link`}
     onClick={()=>handleLinkClick()}>
          <div className="match-item">
            <div className={`match-item_center`}>
              <div className="img-container">
                <img src={image || defImage} />
                <div className={online ? 'online' : 'not_online'}></div>
              </div>
              
              <div className="name-container">
                <h2>{`${firstName}`.trim() || 'Anonymous'}</h2>
                <p className={`${online?'read':'not_read'}`}>{lastMessage}</p>
              </div>

              <div className="date-meta-container">
                <div className="date-container">
                  <span>{formatLastSentDate(lastMessageDate,locale)}</span>
                </div>
        
              </div>
            </div>
          </div>
    </Link>
  );
}

export default Match
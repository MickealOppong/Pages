import { SelectedProfile } from "../components";
import { useAppSelector } from "../store";



const ViewProfile =()=>{

    const url =  new URLSearchParams(location.href.split('?')[1]);

   const id = Number(url.get('id'))
   const postId= Number(url.get('postId'))
  
   
   const currentUserId = useAppSelector((state)=>state.userSlice.id);
    
    return <SelectedProfile userId={id} requestUserId={currentUserId} postId={postId}/>
}
export default ViewProfile
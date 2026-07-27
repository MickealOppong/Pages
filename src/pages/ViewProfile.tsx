import { useParams } from "react-router-dom";
import { SelectedProfile } from "../components";
import { useAppSelector } from "../store";



const ViewProfile =()=>{

   const {id} = useParams();
   
   const currentUserId = useAppSelector((state)=>state.userSlice.id);
    
    return <SelectedProfile userId={parseInt(id as string)} requestorUserId={currentUserId}/>
}
export default ViewProfile
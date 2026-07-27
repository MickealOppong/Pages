
import { FiHeart, FiMenu } from "react-icons/fi";
import { IoNotifications } from "react-icons/io5";
import { LuSettings2 } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { useUnreadNotifCountQuery } from "../features/api/userApi";
import { showSidebarMenu } from "../features/slice/sidebarSlice";
import { showFitler } from "../features/slice/utilSlice";
import { useAppSelector } from "../store";
import "./../css/nav.css";


const Nav =()=> {

   const userId = useAppSelector((state)=>state.userSlice.id)

     const dispatch = useDispatch()

     
         //get notification hook
         const {data:notificationCounter} = useUnreadNotifCountQuery(userId,{refetchOnFocus:true})

  
      const handleButtonClick=()=>{
          dispatch(showSidebarMenu())
      }

      const handleFilterForm=()=>{
        dispatch(showFitler())
      }




  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="navbar__menu" onClick={handleButtonClick}>
          <FiMenu size={24} />
        </button>

        <Link to={'/landing'} className="navbar__logo">
          spotkac
        </Link>
        <FiHeart size={14} className="heart"/>
      </div>

      <div className="navbar__right">

        <button className="icon-button notification-btn" style={{display:'none'}}>
          <IoNotifications size={22} />
          <span className="badge">{notificationCounter?.totalCount}</span>
        </button>

        <NavLink to={'/landing/settings'} className="icon-button" onClick={handleFilterForm}>
          <LuSettings2 size={22} />
        </NavLink>

      </div>
    </header>
  );
}
export default Nav
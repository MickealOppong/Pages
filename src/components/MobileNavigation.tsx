import {
  FiCompass,
  FiHeart,
  FiPlus,
  FiUser,
} from "react-icons/fi";
import { LuMessageCircle, LuSettings } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";

import { useDispatch } from "react-redux";
import { useUnreadNotifCountQuery } from "../features/api/userApi";
import { showForm } from "../features/slice/utilSlice";
import { useAppSelector } from "../store";
import "./../css/MobileNavigation.css";


const  MobileNavigation=() =>{
  const userId = useAppSelector((state)=>state.userSlice.id)
    const {data:notificationCounter} = useUnreadNotifCountQuery(userId,{refetchOnFocus:true})
  const location = useLocation();
    const dispatch = useDispatch()

  const active = (path: string) =>
    location.pathname.startsWith(path);

      const handleShowForm = () => {
          dispatch(showForm());
      }

  return (
    <nav className="mobile-nav">

      <Link
        to="/landing"
        className={`nav-item ${active("/landing") &&
          !active("/landing/messages") &&
          !active("/landing/profile") &&
          !active("/landing/matches")
            ? "active"
            : ""}`}
      >
        <FiCompass size={22} />
        <span>Discover</span>
      </Link>

      <Link
        to="/landing/matches"
        className={`nav-item ${
          active("/landing/matches") ? "active" : ""
        }`}
      >
        <div className="icon-wrapper">
          <FiHeart size={22} />

          {notificationCounter && notificationCounter?.notif['LIKE'] > 0 && (
            <span className="badge">
              {notificationCounter?.notif['LIKE'] }
            </span>
          )}
        </div>

        <span>Matches</span>
      </Link>

      <Link
        to="/landing/create-moment"
        className="create-moment" onClick={()=>handleShowForm()}
      >
        <div className="plus-circle">
          <FiPlus size={28} />
        </div>

        <span>Moment</span>
      </Link>

      <Link
        to="/landing/messages"
        className={`nav-item ${
          active("/landing/messages") ? "active" : ""
        }`}
      >
        <div className="icon-wrapper">
          <LuMessageCircle size={22} />

          {notificationCounter && notificationCounter?.notif['MESSAGE']  > 0 && (
            <span className="badge">
              {notificationCounter?.notif['MESSAGE'] }
            </span>
          )}
        </div>

        <span>Messages</span>
      </Link>

      <Link
        to="/landing/settings"
        className={`nav-item ${
          active("/landing/settings") ? "active" : ""
        }`}
      >
        <LuSettings size={22} />
        <span>Settings</span>
      </Link>
         <Link
        to="/landing/profile"
        className={`nav-item ${
          active("/landing/profile") ? "active" : ""
        }`}
      >
        <FiUser size={22} />
        <span>Profile</span>
      </Link>

    </nav>
  );
}
export default MobileNavigation
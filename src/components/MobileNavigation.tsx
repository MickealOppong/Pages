import {
  FiCompass,
  FiHeart,
  FiMenu,
  FiPlus,
  FiUser,
  FiX,
} from "react-icons/fi";
import { LuMessageCircle, LuSettings } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useUnreadNotifCountQuery } from "../features/api/userApi";
import { showForm } from "../features/slice/utilSlice";
import { useAppSelector } from "../store";
import "./../css/MobileNavigation.css";


const  MobileNavigation=() =>{
  const userId = useAppSelector((state)=>state.userSlice.id)
    const [open, setOpen] = useState<Boolean>(false);

    //translation hook
    const {t} = useTranslation();

    //hook
    const {data:notificationCounter} = useUnreadNotifCountQuery(userId,{refetchOnFocus:true})
  const location = useLocation();
    const dispatch = useDispatch()

  const active = (path: string) =>
    location.pathname.startsWith(path);


        const closeDrawer = () => setOpen(false);

  const handleMoment = () => {
    dispatch(showForm());
    closeDrawer();
  };

/*
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
  */

    return (
    <>
      {open && (
        <div
          className="mobile-nav-overlay"
          onClick={closeDrawer}
        />
      )}

      <button
        className="mobile-menu-button"
        onClick={() => setOpen(!open)}
      >
        {open ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      <aside
        className={`mobile-drawer ${
          open ? "open" : ""
        }`}
      >
        <Link
          to="/landing"
          onClick={closeDrawer}
          className={`drawer-item ${
            active("/landing") &&
            !active("/landing/messages") &&
            !active("/landing/profile") &&
            !active("/landing/settings") &&
            !active("/landing/matches")&&
              !active("/landing/create-moment")
              ? "active"
              : ""
          }`}
        >
          <div className="drawer-left">
            <FiCompass />
          <span>{t('Menu.Discover')}</span>
          </div>
        </Link>

        <Link
          to="/landing/matches"
          onClick={closeDrawer}
          className={`drawer-item ${
            active("/landing/matches")
              ? "active"
              : ""
          }`}
        >
          <div className="drawer-left">
            <FiHeart />
            <span>{t('Menu.Matches')}</span>
          </div>

          {(notificationCounter && notificationCounter?.notif["LIKE"]>0) && (
            <span className="notif-counter" >
              {notificationCounter.notif["LIKE"]}
            </span>
          )}
        </Link>

        <Link
          to="/landing/create-moment"
          onClick={handleMoment}
          className={`drawer-item ${
            active("/landing/create-moment")
              ? "active"
              : ""
          }`}
        >
          <div className="drawer-left">
            <FiPlus className="moment-btn"/>
            <span className="moment">{t('Menu.Moments')}</span>
          </div>
        </Link>

        <Link
          to="/landing/messages"
          onClick={closeDrawer}
          className={`drawer-item ${
            active("/landing/messages")
              ? "active"
              : ""
          }`}
        >
          <div className="drawer-left">
            <LuMessageCircle />
            <span>{t('Menu.Messages')}</span>
          </div>

          { (notificationCounter && notificationCounter?.notif["MESSAGE"]>0)
           && (
            <span className="notif-counter" >
              {notificationCounter.notif["MESSAGE"]}
            </span>
          )}
        </Link>

        <Link
          to="/landing/settings"
          onClick={closeDrawer}
          className={`drawer-item ${
            active("/landing/settings")
              ? "active"
              : ""
          }`}
        >
          <div className="drawer-left">
              <LuSettings />
           <span>{t('Menu.Settings')}</span>
          </div>
         
        </Link>

        <Link
          to="/landing/profile"
          onClick={closeDrawer}
          className={`drawer-item ${
            active("/landing/profile")
              ? "active"
              : ""
          }`}
        >
          <div className="drawer-left">
            <FiUser />
          <span>{t('Menu.Profile')}</span>
          </div>
        </Link>
      </aside>
    </>
  );

}
export default MobileNavigation
import {
    FiCompass,
    FiHeart,
    FiSettings,
    FiUser
} from "react-icons/fi";

import { LuMessageCircle } from "react-icons/lu";
import { MdPostAdd } from "react-icons/md";

import { Link, useLocation } from "react-router-dom";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";
import { useUnreadNotifCountQuery } from "../features/api/userApi";
import { useAppSelector } from "../store";
import "./../css/nav.css";

const  Nav=() =>{


    const location = useLocation()

     //profile image  
     const userId = useAppSelector((state)=>state.userSlice.id)

     //translation hook
     const {t} = useTranslation();
     
         //get notification hook
         const {data:notificationCounter} = useUnreadNotifCountQuery(userId,{refetchOnFocus:true})


         //logout function
   //set and get current page from local storage
    localStorage.setItem('location',location.pathname);

   const currentPage = localStorage.getItem('location');




    const menuItems = useMemo(() => [

        {
            path: "/landing",
            label: "Discover",
            icon: FiCompass
        },

        {
            path: "/landing/matches",
            label: "Matches",
            icon: FiHeart,
            badge: notificationCounter?.notif['LIKE']
        },

        {
            path: "/landing/messages",
            label: "Messages",
            icon: LuMessageCircle,
            badge: notificationCounter?.notif['MESSAGE']
        },

        {
            path: "/landing/create-moment",
            label: "Moments",
            icon: MdPostAdd
        },

        {
            path: "/landing/profile",
            label: "Profile",
            icon: FiUser
        },

        {
            path: "/landing/settings",
            label: "Settings",
            icon: FiSettings
        }

    ], [notificationCounter]);




    return (

        <aside className={`nav-navigation-rail`}>

            <nav className="nav-rail-nav">

                {

                    menuItems.map(item => {

                        const Icon = item.icon;

                        return (

                            <Link key={item.path} to={item.path} className={`nav-rail-item ${currentPage===item.path? "active" : ""}`}>

                                <div className="nav-rail-icon">

                                    <Icon size={22} />

                                    {!!item.badge && (

                                        <span className="nav-badge"> {item.badge} </span>

                                    )}

                                </div>

                                <span className="nav-rail-label">{t(`Menu.${item.label}`)} </span>

                            </Link>

                        );

                    })

                }

            </nav>
        </aside>

    );

}
export default Nav
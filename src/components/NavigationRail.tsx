import {
    FiCompass,
    FiHeart,
    FiLogOut,
    FiSettings,
    FiUser
} from "react-icons/fi";
import defImage from './../assets/default.jpeg';

import { LuMessageCircle } from "react-icons/lu";
import { MdPostAdd } from "react-icons/md";

import { Link, useLoaderData, useLocation, useNavigate } from "react-router-dom";

import { useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import { GoPin } from "react-icons/go";
import { useLogoutMutation } from "../features/api/authApi";
import { useUnreadNotifCountQuery } from "../features/api/userApi";
import { useAppSelector } from "../store";
import type { TUserDataDto } from "../types/TUserDataDto";
import "./../css/NavigationRail.css";

const  NavigationRail=() =>{

    //loader data
      const data = useLoaderData() as TUserDataDto
        const {firstName,lastName,profileImage}=data.data

    const [expanded, setExpanded] = useState<boolean>(false);

    const [pinned, setPinned] = useState<boolean>(JSON.parse(localStorage.getItem('pinned') as string));

    const isExpanded = expanded || pinned;

    const location = useLocation()
    const navigate = useNavigate()

     //profile image 
     const profileImageChange = useAppSelector((state)=>state.userSlice.profileImage)  
     const userId = useAppSelector((state)=>state.userSlice.id)

     //translation hook
     const {t} = useTranslation();
     
       //logout hook
         const [logout] = useLogoutMutation()
         //get notification hook
         const {data:notificationCounter} = useUnreadNotifCountQuery(userId,{refetchOnFocus:true})


         //logout function
   //set and get current page from local storage
    localStorage.setItem('location',location.pathname);

   const currentPage = localStorage.getItem('location');

   //refresh token for logout
 const refreshToken = localStorage.getItem('rtk') as string

 const handleUserLogout= async ()=> {
             
        try {
           const response= await logout(refreshToken)
           if(response.data){
            localStorage.removeItem('rtk')
            localStorage.removeItem('tk')
            navigate('/')
           }
           
        } catch (error) {
            
        }
    }

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


const handleMenuPinned=()=>{
 !pinned? setPinned(true):setPinned(false)
 localStorage.setItem('pinned',String(pinned))
}


    return (

        <aside className={`navigation-rail ${isExpanded ? "expanded" : ""}`}
         onMouseEnter={() => !pinned && setExpanded(true)} onMouseLeave={() =>  !pinned && setExpanded(false)}>

            <header className="rail-header">

                <div className="brand">

                    <FiHeart style={{display:expanded?'none':'flex'}}/>

                    <span>{t('DiscoverFeed.brand_name')}</span>

                </div>
                <button

                    className={`pin-button ${pinned?'active':''}`}

                    onClick={() => handleMenuPinned()}

                >

                    <GoPin />

                </button>

            </header>

            <nav className="rail-nav">

                {

                    menuItems.map(item => {

                        const Icon = item.icon;

                        return (

                            <Link

                                key={item.path}

                                to={item.path}

                                className={`rail-item ${currentPage===item.path? "active" : ""}`}

                            >

                                <div className="rail-icon">

                                    <Icon size={22} />

                                    {!!item.badge && (

                                        <span className="badge">

                                            {item.badge}

                                        </span>

                                    )}

                                </div>

                                <span className="rail-label">

                                    {t(`Menu.${item.label}`)}
                                </span>

                            </Link>

                        );

                    })

                }

            </nav>

    {   
    !expanded? <div className="rail-footer">
        <img className="collapse-img" src={profileImageChange?profileImageChange:profileImage || defImage} />
    </div>
    :  <div className="rail-footer">
      <div className="rail-user-badge">
        <div className="rail-footer__avatar">
          <img src={profileImageChange?profileImageChange:profileImage || defImage} alt="My profile avatar" />
        </div>
        <div className="avatar__info" >
          <h4>{firstName ? `${firstName} ${lastName}` : 'User Account'}</h4>
          <p>  {t(`Menu.Log_in`)}</p>
        </div>
      </div>

      <button className="logout-btn" onClick={handleUserLogout}>
        <FiLogOut size={20} />
        <span>{t(`Menu.Log_out`)}</span>
      </button>
         </div>
        }
       

        </aside>

    );

}
export default NavigationRail
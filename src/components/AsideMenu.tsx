import { FiCompass, FiHeart, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { LuMessageCircle } from "react-icons/lu";
import { MdPostAdd } from "react-icons/md";
import { Link, useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../features/api/authApi";
import { useUnreadNotifCountQuery } from "../features/api/userApi";
import { useAppSelector } from "../store";
import type { TUserDataDto } from "../types/TUserDataDto";
import "./../css/AsideMenu.css";

  

const AsideMenu =()=> {
    const data = useLoaderData() as TUserDataDto
    const {firstName,lastName,profileImage}=data.data
   
 //profile image 
 const profileImageChange = useAppSelector((state)=>state.userSlice.profileImage)  
 const userId = useAppSelector((state)=>state.userSlice.id)
    
   
    const location = useLocation()
    const navigate = useNavigate()


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

     
      return (
  <aside className="aside__menu">
    <div className="sidebar__top">
      <div className="sidebar__logo">
        <div className="logo__container">
          <FiHeart size={14} />
          <span>spotkac</span>
        </div>
        
      </div>
      <nav className="sidebar__nav">
        <Link to={'/landing'} className={`menu-container ${currentPage === '/landing' ? 'active' : ' '}`}>
          <div>
            <FiCompass size={20} />
          <span>Discover</span>
          </div>
        </Link>
        <Link to={'/landing/matches'} className={`menu-container ${currentPage === '/landing/matches' ? 'active' : ' '}`}>
          <div>
            <FiHeart size={20} />
          <span>Matches</span>
          </div>
          <span className="counter">{notificationCounter?.notif['LIKE']}</span>
        </Link>
        <Link to={'/landing/messages'} className={`menu-container ${currentPage?.includes('/landing/messages') ? 'active' : ' '}`}>
          <div>
            <LuMessageCircle size={20} />
          <span>Messages</span>
          </div>
          <span className="counter">{notificationCounter?.notif['MESSAGE']}</span>
        </Link>
        <Link to={'/landing/my-broadcasts'} className={`menu-container ${currentPage === '/landing/my-broadcasts' ? 'active' : ' '}`}>
          <div>
            <MdPostAdd size={20} />
          <span>My Gallery</span>
          </div>
        </Link>
        <Link to={'/landing/profile'} className={`menu-container ${currentPage === '/landing/profile' ? 'active' : ' '}`}>
          <div>
            <FiUser size={20} />
          <span>Profile</span>
          </div>
        </Link>
        <Link to={'/landing/settings'} className={`menu-container ${currentPage === '/landing/settings' ? 'active' : ' '}`}>
          <div>
            <FiSettings size={20} />
          <span>Settings</span>
          </div>
        </Link>
      </nav>
    </div>

    {/* Section Footer: Dynamic Profile Badge & Logout Trigger */}
    <div className="sidebar__bottom">
      <div className="sidebar__user-badge">
        <div className="badge__avatar">
          <img src={profileImageChange?profileImageChange:profileImage || 'https://unsplash.com'} alt="My profile avatar" />
        </div>
        <div className="badge__info">
          <h4>{firstName ? `${firstName} ${lastName}` : 'User Account'}</h4>
          <p>Logged In</p>
        </div>
      </div>

      <button className="logout-btn" onClick={handleUserLogout}>
        <FiLogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  </aside>
);
    

}
export default AsideMenu
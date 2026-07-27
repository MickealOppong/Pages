import { CiHeart, CiUser } from "react-icons/ci"
import { FiMessageCircle, FiSettings } from "react-icons/fi"
import { IoIosLogOut } from "react-icons/io"
import { IoCreateOutline } from "react-icons/io5"
import { MdPostAdd } from "react-icons/md"
import { RiCompassDiscoverLine, RiHeart2Fill } from "react-icons/ri"
import { SlLike } from "react-icons/sl"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useLogoutMutation } from "../features/api/authApi"


const SidebarMenu = ()=>{

   
    const svgSize = 20;
    const location = useLocation()
    const navigate = useNavigate()

    //logout hook
    const [logout] = useLogoutMutation()

 
    //set and get current page from local storage
      localStorage.setItem('location',location.pathname);
   const currentPage = localStorage.getItem('location');

 const refreshToken = localStorage.getItem('rtk') as string

 const handleUserLogout= async ()=> {
      
       console.log(refreshToken);
       
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

    
    return <aside className="aside" >

        <div className="aside-container">
            <div className="aside-main">
                              <Link to={'/landing'} className={`menu-container ${currentPage==='/landing'? 'active' :' '}`} >
                                 <div className="item">
                                      <RiCompassDiscoverLine size={svgSize}/>
                                   <p>Discover</p>
                                 </div>
                               </Link>
                               <Link to={'/landing/create-post'} className={`menu-container ${currentPage==='/landing/create-post'? 'active' :' '}`}>
                                                   <div className="item">
                                                       <IoCreateOutline size={svgSize}/>
                                                   <p >Create post</p>
                                                   </div>
                               </Link>
                               <Link to={'/landing/my-posts'} className={`menu-container ${currentPage==='/landing/my-posts'? 'active' :' '}`} >
                                                   <div className="item">
                                                       <MdPostAdd size={svgSize}/>
                                                   <p >My posts</p>
                                                   </div>
                               </Link>
                               <Link to={'/landing/matches'} className={`menu-container ${currentPage==='/landing/matches'? 'active' :' '}`} >
                                   <div className="item">
                                       <CiHeart size={svgSize}/>
                                   <p >Matches</p>
                                   </div>
                                 <div className="counter">  <span >100</span></div>
                               </Link>
                               <Link to={'/landing/likes'} className={`menu-container ${currentPage ==='/landing/likes'? 'active' :' '}`} >
                                  <div className="item">
                                    <SlLike size={svgSize}/>
                                 <p >Likes</p>
                                  </div>
                               </Link>
                               <Link to={'/landing/messages'} className={`menu-container ${currentPage==='/landing/messages'? 'active' :' '}`} >
                                   <div className="item">
                                       <FiMessageCircle size={svgSize}/>
                                         <p >Messages</p>
                                   </div>
                                <div className="counter">  <span >10</span></div>
                               </Link>
                               <Link to={'/landing/profile'} className={`menu-container ${currentPage==='/landing/profile'? 'active' :' '}`}>
                                 <div className="item">
                                     <CiUser size={svgSize}/>
                                  <p >Profile</p>
                                 </div>
                               </Link>
                               <Link to={'/landing/settings'} className={`menu-container ${currentPage==='/landing/settings'? 'active' :' '}`} >
                                  <div className="item">
                                     <FiSettings size={svgSize}/>
                                 <p>Settings</p>
                                  </div>
                               </Link>
            </div>
              <div className="logout-container">
               <div className="logout">
                 <IoIosLogOut size={svgSize}/>
                <button onClick={()=>handleUserLogout()}>Log out</button>
               </div>
            </div>
             <div className="aside-footer">
                <div className="add-content"> 
                    <RiHeart2Fill/>
                    <p>Upgrade to Premium</p>
                <span>Unlock more features and find your perfect match</span>
                    <button>Upgrade now</button>
                </div>
             </div>
        </div>
    </aside>
}
export default SidebarMenu
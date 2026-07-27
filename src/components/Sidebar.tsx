import { FaDailymotion, FaHamburger, FaHeart, FaSignOutAlt, FaStar, FaTimes, FaUser } from "react-icons/fa"
import { RiCloseFill, RiCompass2Fill, RiCompassDiscoverFill, RiCompassDiscoverLine, RiHeart2Fill,RiSettings2Fill } from "react-icons/ri"
import { FaMessage } from "react-icons/fa6"
import { appName } from "../data/data"
import { useDispatch } from "react-redux"
import { hideSidebarMenu } from "../features/slice/sidebarSlice"
import { useAppSelector } from "../store"
import { CiHeart, CiLogout, CiStar, CiUser } from "react-icons/ci"
import { FiMessageCircle, FiSettings } from "react-icons/fi"
import { IoIosLogOut } from "react-icons/io"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useLogoutMutation } from "../features/api/authApi"
import profileImage from './../assets/profile.jpeg'
import defaultImage from './../assets/default.jpeg'
import { IoBookSharp, IoCreateOutline } from "react-icons/io5"
import { MdPostAdd } from "react-icons/md"
import { SlLike } from "react-icons/sl"

const Sidebar = ()=>{

    const showSidebar = useAppSelector((state)=>state.sidebarSlice.showSidebar)  
   
    const svgSize = 20;
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()

    //logout hook
    const [logout] = useLogoutMutation()

    const handleCloseButtonClick=()=>{
        dispatch(hideSidebarMenu())
         
    }
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

    return <aside className={`${showSidebar?'sidebar':'hide-sidebar'}`}>
       <div className="sidebar-section">
       <div className="sidebar-main">
          <div className="sidebar-header">
             <div className="header" >
             <div className="logo-container">
               <div className="logo-item">
                 <FaHeart size={12}/>
                 <span>{appName}</span>
               </div>
                  <button className="close-btn" onClick={()=>handleCloseButtonClick()}><RiCloseFill/></button>
               </div>
               <div className='image-container' >
                        <div className="avatar"> <img src={profileImage} alt={defaultImage} /></div>
            
                  <p>{'Yaw Mike'}</p>
                   <Link to={'/landing/profile'} onClick={()=>handleCloseButtonClick()}>View profile</Link>
              </div>
            </div>             
         </div>
         <div className="border" style={{display:'none'}}></div>
        <div className="sidebar-content">
            <div className="sidebar-main">
                <Link to={'/landing'} className={`menu-container ${currentPage==='/landing'? 'active' :' '}`} onClick={()=>handleCloseButtonClick()}>
                  <div className="item">
                       <RiCompassDiscoverLine size={svgSize}/>
                    <p>Discover</p>
                  </div>
                </Link>
                <Link to={'/landing/create-post'} className={`menu-container ${currentPage==='/landing/post'? 'active' :' '}`}onClick={()=>handleCloseButtonClick()} >
                                    <div className="item">
                                        <IoCreateOutline size={svgSize}/>
                                    <p >Create post</p>
                                    </div>
                </Link>
                <Link to={'/landing/my-posts'} className={`menu-container ${currentPage==='/landing/my-posts'? 'active' :' '}`}onClick={()=>handleCloseButtonClick()} >
                                    <div className="item">
                                        <MdPostAdd size={svgSize}/>
                                    <p >My posts</p>
                                    </div>
                </Link>
                <Link to={'/landing/matches'} className={`menu-container ${currentPage==='/landing/matches'? 'active' :' '}`} onClick={()=>handleCloseButtonClick()}>
                    <div className="item">
                        <CiHeart size={svgSize}/>
                    <p >Matches</p>
                    </div>
                  <div className="counter">  <span >100</span></div>
                </Link>
                <Link to={'/landing/likes'} className={`menu-container ${currentPage ==='/landing/likes'? 'active' :' '}`} onClick={()=>handleCloseButtonClick()}>
                   <div className="item">
                     <SlLike size={svgSize}/>
                  <p >Likes</p>
                   </div>
                </Link>
                <Link to={'/landing/messages'} className={`menu-container ${currentPage==='/landing/messages'? 'active' :' '}`} onClick={()=>handleCloseButtonClick()}>
                    <div className="item">
                        <FiMessageCircle size={svgSize}/>
                          <p >Messages</p>
                    </div>
                 <div className="counter">  <span >10</span></div>
                </Link>
                <Link to={'/landing/profile'} className={`menu-container ${currentPage==='/landing/profile'? 'active' :' '}`} onClick={()=>handleCloseButtonClick()}>
                  <div className="item">
                      <CiUser size={svgSize}/>
                   <p >Profile</p>
                  </div>
                </Link>
                <Link to={'/landing/settings'} className={`menu-container ${currentPage==='/landing/settings'? 'active' :' '}`} onClick={()=>handleCloseButtonClick()}>
                   <div className="item">
                      <FiSettings size={svgSize}/>
                  <p>Settings</p>
                   </div>
                </Link>
            </div>
        </div>
        <div className="sidebar-footer">
            <div className="logout-container">
               <div className="logout">
                 <IoIosLogOut size={svgSize}/>
                <button onClick={()=>handleUserLogout()}>Log out</button>
               </div>
            </div>
        </div>
       </div>
       </div>
    </aside>
}
export default Sidebar
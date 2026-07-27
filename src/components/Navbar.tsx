
import { Link } from 'react-router-dom';
import { appName } from '../data/data';
import './../css/nav.css';

import { FaHeart } from 'react-icons/fa';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { LuSettings2 } from 'react-icons/lu';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useDispatch } from 'react-redux';
import { showSidebarMenu } from '../features/slice/sidebarSlice';
    
const Navbar = ()=>{

 // const showSidebar = useAppSelector((state)=>state.sidebarSlice.showSidebar);
   const dispatch = useDispatch()

    const handleButtonClick=()=>{
        dispatch(showSidebarMenu())
    }

        return <nav className="nav">
     <div className='nav-header'>
       <article className='nav-main'>
      <div className='logo-container'>
         <div className='hamburger-container'>
         <button className='hamburger-btn' onClick={()=>handleButtonClick()}><RxHamburgerMenu/></button>
       </div>
          <div className='logo-container'>
           <div className='logo'>
             <Link to={"/landing"} >{appName}</Link>
            <FaHeart size={12}/>
           </div>
          </div>
      </div>
       <div className='image-container'>
        <div className='notification-container'>
          <span className='notification'>  <IoIosNotificationsOutline size={20}/></span>
          <span>{12}</span>
        </div>
          <div>
            <LuSettings2/>
           </div>          
        </div>
      </article>
     </div>
    </nav>
    
}
export default Navbar

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Outlet, redirect } from "react-router-dom";
import type { Store } from "redux";
import { Nav } from "../components/index";
import MobileNavigation from "../components/MobileNavigation";
import NavigationRail from "../components/NavigationRail";
import { userApi } from "../features/api/userApi";
import { type AppDispatch, type RootState } from "../store";
import type { TUserDataDto } from "../types/TUserDataDto";
import './../css/SharedLayout.css';

export const loader =(store:Store<RootState>)=>async ()=>{
    const username= store.getState().userSlice.username;
    
    if(username){

      const userId = store.getState().userSlice.id;
      
      
          const dispatch = store.dispatch as AppDispatch;
      
          const promise = await dispatch(userApi.endpoints.getUser.initiate(userId));
       
         const response = promise.data as TUserDataDto;

          return response;
          
    }else{
         return redirect('')
    }

}



const SharedLayout = ()=>{

  
    //state
    const pageRef = useRef<HTMLElement | null>(null);
     //const [pageWidth,setPageWidth ]= useState<number>(0);


     //dispatcher
     const dispatch = useDispatch()

  let width =0;
 useEffect(()=>{

   window.addEventListener('resize',()=>{
  const page = pageRef.current
      if(page instanceof HTMLElement){
         width = page.getBoundingClientRect().width;
        
        if(width>768){
          //  dispatch(hideSidebarMenu())
        }
    }

  })
  window.removeEventListener('resize',()=>{})
 },[width])



    return <section className="sharedLayout" ref={pageRef}>
      <section className="group">
         <NavigationRail />
         <Nav/>
       <MobileNavigation/>
      </section>
         <main>
              <Outlet/>
        </main>
      </section>
}
export default SharedLayout
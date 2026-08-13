
import { useEffect, useRef } from "react";
import { Outlet, redirect, useLoaderData } from "react-router-dom";
import type { Store } from "redux";
import { Nav } from "../components";
import NavigationRail from "../components/NavigationRail";
import RulesOfEngagement from "../components/RulesOfEngagement";
import { userApi } from "../features/api/userApi";
import { type AppDispatch, type RootState } from "../store";
import type { TUserDataDto } from "../types/TUserDataDto";
import './../css/SharedLayout.css';

export const loader =(store:Store<RootState>)=>async ()=>{
    const username= store.getState().userSlice.username;
    
    if(username){

     const userId = store.getState().userSlice.id;
      
      
          const dispatch = store.dispatch as AppDispatch;
      
          const promise = await dispatch(userApi.endpoints.getUser.initiate(userId,{forceRefetch:true}));
       
  
          if(promise.isSuccess){
             const response = promise.data as TUserDataDto;

               if(response.httpStatus==='404 NOT_FOUND'){
           
                     return redirect('/')
                 }

          return response;
          }
          if(promise.isError){
            return redirect('/')
          }
          
    }else{
         return redirect('')
    }

}



const SharedLayout = ()=>{
const userData = useLoaderData() as TUserDataDto
  
    //state
    const pageRef = useRef<HTMLElement | null>(null);
     //const [pageWidth,setPageWidth ]= useState<number>(0);


     //dispatcher
    // const dispatch = useDispatch()

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


 

   if (!userData.data.acceptedRules) {
    return (
      <RulesOfEngagement />
    );
  }


    return <section className="sharedLayout" ref={pageRef}>
        <Nav/>
         <NavigationRail />
         <main>
              <Outlet/>
        </main>
      </section>
}
export default SharedLayout
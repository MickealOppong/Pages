
import { redirect, useLoaderData, useNavigate, useNavigation, useRevalidator, useSearchParams } from "react-router-dom";
import type { Store } from "redux";
import { transApi, useAcceptLikeMutation, useAddToLikeMutation } from "../features/api/transApi";
import { useAppSelector, type AppDispatch, type RootState } from "../store";
import type { TResponseDto } from "../types/TResponseDto";
import "./../css/Discover.css";

import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineFileSearch } from "react-icons/ai";
import { DiscoverCard, Loading, NotificationToast, Pagination } from "../components";
import DiscoverHeader from "../components/DiscoverHeader";
import type { TErrorResponse } from "../types/TErrorResponse";
import { activityColors, getAgeFromDateOfBirth, isFetchBaseQueryError, type ActivityType } from "../util/util";



export const loader =(store:Store<RootState>)=>async ({request}:{request:Request})=>{
     const username= store.getState().userSlice.username;

         
         if(username){
     
        const userId = store.getState().userSlice.id;
        const url =  new URLSearchParams(request.url.split('?')[1]);

        const page = Number(url.get('page'))
        const city = url.get('city')as string;
        const gender = url.get('gender')as string;
        const activity = url.get('activity')as string;
        const fromAge = Number(url.get('min-age'))
        const toAge = Number(url.get('max-age'))


            const dispatch = store.dispatch as AppDispatch;

            const promise= await dispatch(transApi.endpoints.getAllPost.initiate({userId,page,fromAge,toAge,city,activity,gender},{forceRefetch:true}));
                
            
            const data:TResponseDto  = promise.data as TResponseDto;
    
            
              return data||[];
               
         }else{
              return redirect('')
         }

   
}


// Assuming helper function is imported or declared globally

const Discover= () => {
  // 1. Hooks & Routing
  const navigate = useNavigate();
  const navigation = useNavigation()
  const { revalidate } = useRevalidator();

  //state variables
   const [message,setMessage] = useState<string>('');
   const[showMessage,setShowMessage]=useState<boolean>(false)
   const[messageType,setMessageType] = useState<string>('');

    const [, setSearchParams] = useSearchParams();

    //loader data
  const posts = useLoaderData() as TResponseDto;

  

    ///translation hook
    const {t} = useTranslation();
  

  // 2. Redux State
  const senderId = useAppSelector((state) => state.userSlice.id);

  // 3. API Mutations
  const [addToLike] = useAddToLikeMutation();
  const [acceptLikeRequest] = useAcceptLikeMutation();


  

  // 8. Event Handlers
  const getDynamicColours = (type: ActivityType) => {
    return activityColors[type] ?? { background: "#F3F4F6", color: "#374151" };
  };

  const handleViewProfileButtonClick = (id: number,postId:number) => {
     const queryParams = new URLSearchParams(window.location.search);
        queryParams.set('id',String(id))
         queryParams.set('postId',String(postId))

        setSearchParams(queryParams);
     localStorage.setItem('filter',JSON.stringify(queryParams))
    navigate(`/landing/view/?${queryParams}`);
  };

  const handleInterestedButtonClick = async (
    senderId: number,
    receiverId: number,
    postId: number,
    isAcceptRequest: boolean
  ) => {
    try {
      if (isAcceptRequest) {
        const response = await acceptLikeRequest({ senderId, receiverId });        
        if ('data' in response && response.data) revalidate();
      } else {
        const response = await addToLike({ senderId, receiverId, postId })  
        if ('data' in response && response.data) revalidate();
        if (response.error && isFetchBaseQueryError(response.error)) {
           
           
            const errorResponse = response.error as FetchBaseQueryError
            const errorMessage = errorResponse.data as TErrorResponse
            console.log(errorMessage.message);
            setMessage(()=>errorMessage.message)
            setShowMessage(()=>!showMessage);           
            setMessageType('blocked')
        }
        
      }
    } catch (error) {
      console.error("Failed to process engagement action:", error);
    }
  };

  

  if(navigation.state==='loading'){
    return <Loading/>
  }


return (

    <>
     {showMessage && <NotificationToast message={message} type={messageType}/>}
    <div className="discover-page" >

        <div className="discover-center">

            <div className="discover">

                {/* ===========================
                    Sticky Header
                =========================== */}

                <header className="discover-header">
                    <DiscoverHeader />
                </header>

                {/* ===========================
                    Feed
                =========================== */}

                <div className="discover-content">

                    {!posts?.data || posts.data.length === 0 ? (
                          <div className="empty-state">
                                <div className="empty-card">
                                  <div className="empty-icon"><AiOutlineFileSearch/></div>
                                  <h3>{t('discover_Dialog.title')}</h3>
                                  <p>{t('discover_Dialog.Message')}</p>
                                </div>
                              </div>

                    ) : (

                        <section className="discover-feed">

                            {posts.data.map((post) => {

                                const media =
                                    post.media?.toLowerCase() ?? "";

                                const isVideo =
                                    media.endsWith(".mp4") ||
                                    media.endsWith(".mov") ||
                                    media.endsWith(".webm");

                                /*
                                 * Every third card becomes landscape.
                                 * This creates a magazine style feed.
                                 */

                                const layout =
                                    post.mediaOrientation === 'landscape'
                                        ? "landscape"
                                        : "portrait";

                                return (

                                    <DiscoverCard
                                        key={post.postId}
                                        layout={layout}
                                        post={post}
                                        senderId={senderId}
                                        isVideo={isVideo}
                                        getAgeFromDateOfBirth={
                                            getAgeFromDateOfBirth
                                        }
                                        handleInterestedFunc={
                                            handleInterestedButtonClick
                                        }
                                        handleViewProfileFunc={
                                            handleViewProfileButtonClick
                                        }
                                        getDynamicColours={
                                            getDynamicColours
                                        }
                                    />

                                );

                            })}

                        </section>

                    )}

                </div>

            </div>

        </div>

        {/* ===========================
            Pagination
        =========================== */}

        <footer className="discover-pagination">

            <Pagination
                currentPage={1}
                totalPages={5}
            />

        </footer>

    </div>
    </>
);

};

export default Discover;



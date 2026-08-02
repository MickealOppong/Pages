import { useTranslation } from "react-i18next";
import { FiEye, FiPlus, FiTrash } from "react-icons/fi";
import { GoPeople } from "react-icons/go";
import { useDispatch } from "react-redux";
import { useLoaderData, useRevalidator } from "react-router-dom";
import type { Store } from "redux";
import { CreateBroadcast, Overlay, VideoPlayer } from "../components/index";
import { transApi, useDeletePosByIdMutation } from "../features/api/transApi";
import { showForm } from "../features/slice/utilSlice";
import type { AppDispatch, RootState } from "../store";
import { useAppSelector } from "../store";
import type { TResponseDto } from "../types/TResponseDto";
import { sanitizeBackendKey } from "../util/util";
import "./../css/UserPost.css";
import "./../css/overlay.css";

export const loader = (store: Store<RootState>) => async () => {
    const userId = store.getState().userSlice.id;
    const dispatch = store.dispatch as AppDispatch;

    const promise = await dispatch(transApi.endpoints.getAllPostByUserId.initiate(userId,{forceRefetch:true}));
    const data: TResponseDto = promise.data as TResponseDto;

    
    return data;
}

const UserBroadcast = () => {
    const userPosts = useLoaderData() as TResponseDto;
    const revalidate = useRevalidator()

    
    // Delete post hook
    const [deleteBroadcast] = useDeletePosByIdMutation();
    const showBroadcastForm = useAppSelector((state) => state.utilSlice.showForm);
    const dispatch = useDispatch();

    const handleShowForm = () => {
        dispatch(showForm());
    }

    const handleDeleteBroadcast = async (id: number) => {
        try {
            const response = await deleteBroadcast(id);             
                
            if (String(response.data?.httpStatus)==='200 OK') {
              revalidate.revalidate();
            }

        
        } catch (error:any) {

        }
    }

        //translation hook
      const {t} = useTranslation();
    

    
    const portrait = userPosts.data.filter((data)=>data.mediaOrientation==='portrait')
    const landscape = userPosts.data.filter((data)=>data.mediaOrientation==='landscape')
    
    return (
     <>
       {
        showBroadcastForm?<Overlay />:<></>
       }
        <div className="user-posts">
          
            <div className="show-form" style={{ display: showBroadcastForm ? 'flex' : 'none' }}>
                <CreateBroadcast />
            </div>

            <div className="page-header">
                <div>
                    <h1>{t('My_moments.welcomeMessage')}</h1>
                    <p>{t('My_moments.sub_message')}</p>
                </div>

                <button className="create-btn" onClick={handleShowForm}>
                    <FiPlus size={20} />
                {t('My_moments.btn')}
                </button>
            </div>

            <div className="posts-portrait">
                {portrait && portrait.map((post) => {
                    //  STEP 1: Determine if media target matches web video extension loops
                    const isVideo = post.media?.toLowerCase().endsWith('.mp4') || 
                                    post.media?.toLowerCase().endsWith('.mov') || 
                                    post.media?.toLowerCase().endsWith('.webm');                                   

                    return (
                        <article className={`post-portrait`} key={post.postId}>
                            <span className="visibility">{t(`My_moments.visibility.${post.visibility.toLowerCase()}`)}</span>
            
                            {isVideo ?
                               <>
                               <VideoPlayer src={post.media} poster="" view={post.mediaOrientation}/>
                               </>
                             :  <img src={post.media} alt="" className={`user-post-image`}/>
                            }

                            <div className="post-content">
                                <div className="post-meta">
                                    <span className="category">
                                       {t(`Moments.${sanitizeBackendKey(post.type)}`)}
                                    </span>
                                </div>

                               <div className="caption">
                                 <p>{post.content}</p>
                               </div>

                                <div className="post-actions">
                                    <button className="btn likes-btn">
                                        <FiEye size={18} />
                                        {post.viewsCount}
                                    </button>
                                    <button className="btn delete-btn" onClick={() => handleDeleteBroadcast(post.postId)}>
                                        <FiTrash size={18} />
                                      {t('My_moments.delete_btn')}
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
              <div className="posts-landscape">
                {landscape && landscape.map((post) => {
                    //  STEP 1: Determine if media target matches web video extension loops
                    const isVideo = post.media?.toLowerCase().endsWith('.mp4') || 
                                    post.media?.toLowerCase().endsWith('.mov') || 
                                    post.media?.toLowerCase().endsWith('.webm');                                   

                    return (
                        <article className={`post-landscape`} key={post.postId}>
                            <span className="visibility">{t(`My_moments.visibility.${post.visibility.toLowerCase()}`)}</span>
            
                            {isVideo ?
                               <>
                               <VideoPlayer src={post.media} poster="" view={post.mediaOrientation}/>
                               </>
                             :  <img src={post.media} alt="" className={`user-post-image`}/>
                            }

                            <div className="post-content">
                                <div className="post-meta">
                                    <span className="category">
                                       {t(`Moments.${sanitizeBackendKey(post.type)}`)}
                                    </span>
                                </div>

                                <p>{post.content}</p>

                                <div className="post-actions">
                                    <button className="btn likes-btn">
                                        <GoPeople size={18} />
                                        {post.viewsCount}
                                    </button>
                                    <button className="btn delete-btn" onClick={() => handleDeleteBroadcast(post.postId)}>
                                        <FiTrash size={18} />
                                    {t('My_moments.delete_btn')}
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
     </>
    );
}

export default UserBroadcast;

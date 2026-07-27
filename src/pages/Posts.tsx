import type { Store } from "@reduxjs/toolkit";
import { BiRepost } from "react-icons/bi";
import { FiEye } from "react-icons/fi";
import { useGetAllPostQuery } from "../features/api/transApi";
import { useAppSelector, type RootState } from './../store';



export const loader = (store: Store<RootState>) => () => {
 const userId= store.getState().userSlice.id;
 const username= store.getState().userSlice.username;
//console.log(userId," "+username);


 return null;
}
const Posts = ()=>{
const userId = useAppSelector((state)=>state.userSlice.id);



   const {data:getDta} = useGetAllPostQuery(userId)

   console.log(getDta);
   
    //user data
    //const name = useAppSelector((state)=>state.userSlice.firstName)


    return <section className="my-post">
   
            <div className="main-container">
                <div className="post-content">
                 {
                    getDta?.data.map((item)=>{
                        return <article className="item" key={item.postId}>
                                <div className="data-content">
                                    <div>
                                        <p>{item.type}</p>
                                        <p>{item.status}</p>
                                    </div>
                                    <div className="content">
                                        <p>{item.content}</p>
                                     </div>
                                </div>
                                <div>
                                     <div className="view-container">
                                        <FiEye/>
                                    <span>{item.reachCount}</span>
                                    </div>
                                      <button>
                                        <BiRepost/>
                                        <span>Repost</span>
                                      </button>
                                </div>
                        </article>
                    })
                 }
            </div>
            </div>
    </section>
}

export default Posts
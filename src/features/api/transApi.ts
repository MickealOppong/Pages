import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TFilter } from "../../types/TFilter";
import type { TLikeRequest } from "../../types/TLikeRequest";
import type { TLikeResponse } from "../../types/TLikeResponse";
import type { TLikes } from "../../types/TLikes";
import type { TMatchRequest } from "../../types/TMatchRequest";
import type { TResponseDto } from "../../types/TResponseDto";
import { baseUrl } from "./baseUrl";





export const transApi = createApi({
    reducerPath:'transApi',
    baseQuery:fetchBaseQuery({
        baseUrl,
        
            prepareHeaders: (headers) => {
      // RTK Query runs this function EVERY time you make a request
      const token = localStorage.getItem('tk')??'';

      if (token) {
       headers.set('Authorization', `Bearer ${token}`);
     //  headers.set('Content-Type','application/json')
      }
      return headers;
    },
    
    }),
    tagTypes:['match','post','matches','posts','user'],
    endpoints:(build)=>({
        createPost:build.mutation<string,FormData>({
            query:(body)=>({
                url:'/trans/broadcast',
                method:'post',
              body
            }),
            invalidatesTags:['post','posts','user']
        }),
        deletePost:build.mutation<string,string>({
            query:(id)=>({
                   url:`/trans/delete/${id}`,
                method:'post',
               params:{
                id
               }
            }),
            invalidatesTags:['posts']
        }),
        getAllPostByUserId:build.query<TResponseDto,number>({
            query:(userId)=>({
                url:`/trans/broadcast/${userId}`,
                params:{
                    userId,
                }
            }),
            providesTags:['posts','post']
        }),
        getAllPost:build.query<TResponseDto,TFilter>({
            query:({userId,city,fromAge,toAge,page,activity,gender})=>({
                url:"/trans/broadcasts",
                params:{
                    userId,
                    city,
                    fromAge,
                    toAge,
                    page,
                    activity,
                    gender
                }
               
            }),
            providesTags:['posts']
        }),
        deletePosByIdt:build.mutation<boolean,number>({
            query:(postId)=>({
                url:`/trans/broadcast/delete/${postId}`,
                params:{
                   postId
                },
                method:'delete'
            }),
            invalidatesTags:['posts','post']
        }),
          addToLike:build.mutation<TLikeResponse,TLikeRequest>({
            query:({senderId,receiverId,postId})=>({
                url:`/request/like`,
                params:{
                   senderId,
                   receiverId,
                   postId
                },
                method:'Post'
            }),
            invalidatesTags:['matches']
        }),
        myLikes:build.query<TLikes,number>({
            query:(userId)=>({
                url:`/request/likes`,
                params:{
                  userId
                },
            }),
            providesTags:['matches']
        }),
         myMatches:build.query<TLikes,number>({
            query:(userId)=>({
                url:`/request/matches`,
                params:{
                  userId,
                },
            }),
            providesTags: ['matches']
        }),
        getMatch:build.query<TLikes,TMatchRequest>({
            query:({matchId,currentUserId})=>({
                url:`/request/match`,
                params:{
                 matchId,
                 currentUserId
                },
            }),
            providesTags:['match']
        }),
        removeLike:build.mutation<boolean,number>({
            query:(matchId)=>({
                url:`/request/my-like/${matchId}`,
                params:{
                  matchId
                },
                method:'DELETE'
            }),
            invalidatesTags:['matches']
        }),
        acceptLikeById:build.mutation<boolean,TMatchRequest>({
            query:({matchId,currentUserId})=>({
                url:`/request/accept/${matchId}`,
                params:{
                  matchId,
                  currentUserId
                },
                method:'PATCH'
            }),
            invalidatesTags:['matches']
        }),
        acceptLike:build.mutation<boolean,TLikeRequest>({
            query:({senderId,receiverId})=>({
                url:`/trans/accept-request`,
                params:{
                  senderId,
                  receiverId,
                },
                method:'PATCH'
            }),
            invalidatesTags:['matches']
        }),
             updateReach:build.mutation<void,number>({
            query:(postId)=>({
                url:`/api/analytics/view`,
                params:{
                 postId,
                },
                method:'PATCH'
            }),
            invalidatesTags:['post','posts']
        }),
    })
})
export const {useCreatePostMutation,useDeletePostMutation,
    useGetAllPostByUserIdQuery,useDeletePosByIdtMutation,useGetAllPostQuery
,useAddToLikeMutation,useLazyMyLikesQuery,useRemoveLikeMutation,useAcceptLikeMutation,useAcceptLikeByIdMutation,useMyMatchesQuery,useLazyGetMatchQuery
,useUpdateReachMutation}= transApi
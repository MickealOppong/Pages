import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TChangePasswordDto } from "../../types/TChangePasswordDto";
import type { TMessages } from "../../types/TMessages";
import type { TNotificationDto } from "../../types/TNotificationDto";
import type { TProfileRequest } from "../../types/TProfileRequest";
import type { TResponseDto } from "../../types/TResponseDto";
import type { TUserDataDto } from "../../types/TUserDataDto";
import { baseUrl } from "./baseUrl";





export const userApi = createApi({
    reducerPath:'userApi',
    baseQuery:fetchBaseQuery({
        baseUrl,
                  prepareHeaders: (headers) => {
      // RTK Query runs this function EVERY time you make a request
     const token = localStorage.getItem('tk')??'';

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    
    }),
    tagTypes:['user','count','notif'],
    endpoints:(build)=>({
        getUser:build.query<TUserDataDto,number>({
            query:(userId)=>({
                url:`/users/user/${userId}`,
                params:{
                    userId
                },
            }),
              providesTags:['user'],
          
        }),
         getUserProfile:build.query<TUserDataDto,number>({
            query:(userId)=>({
                url:`/users/profile/${userId}`,
                params:{
                    userId
                }
            }),
             providesTags:['user'],
        }),
          getUserViewProfile:build.query<TUserDataDto,TProfileRequest>({
            query:({userId,requestorUserId})=>({
                url:`/users/view/profile/${userId}`,
                params:{
                    userId,
                    requestorUserId
                }
            }),
             providesTags:['user'],
        }),
         updateUserDetails:build.mutation<boolean,FormData>({
            query:(body)=>({
                url:'/users/update-data',
               body,
               method:'PATCH'
            }),
           invalidatesTags:['user']
        }),
        
    getMessages:build.query<TMessages[],number>({
            query:(matchId)=>({
                url:`/api/messages/${matchId}`,
               params:{
                matchId
               }
            }),
             providesTags:['user'],
        }),
    changePassword:build.mutation<TResponseDto,TChangePasswordDto>({
            query:(body)=>({
                url:`/users/change-password`,
                body,
               method:'PUT',
            }),
        }),
          deleteAccount:build.mutation<TResponseDto,void>({
            query:()=>({
                url:`/users/delete-account`,
               method:'DELETE',
            }),
        }),
          createMessageNotif:build.mutation<void,{sender:number,receiver:number,targetId:number}>({
            query:({sender,receiver,targetId})=>({
                url:`/notif/create`,
                params:{
                    sender,receiver,targetId
                },
               method:'POST',
            }),
            invalidatesTags:['count','notif']
        }),
         markNotifAsRead:build.mutation<void,{targetId:number,type:string,recipient:number}>({
            query:({targetId,type,recipient})=>({
                url:`/notif/update`,
                params:{
                   targetId,
                   type,
                   recipient
                },
               method:'PUT',
            }),
            invalidatesTags:['count','notif']
        }),
         unreadNotifCount:build.query<TNotificationDto,number>({
            query:(recipientId)=>({
                url:`/notif/user-notif`,
                params:{
                   recipientId
                },
            }),
            providesTags:['count','notif']
        }),
          acceptRules:build.mutation<boolean,void>({
            query:()=>({
                url:`/users/accept-rules`,
                method:'PUT',
            }),
            invalidatesTags:['user']
        }),
    }),
 
})
export const {useGetUserQuery,useUpdateUserDetailsMutation,useLazyGetMessagesQuery,
    useLazyGetUserProfileQuery,useGetUserProfileQuery,useGetUserViewProfileQuery,useLazyGetUserViewProfileQuery,useChangePasswordMutation
,useDeleteAccountMutation,useCreateMessageNotifMutation,useMarkNotifAsReadMutation,useUnreadNotifCountQuery,useAcceptRulesMutation}=userApi

import { createSlice } from "@reduxjs/toolkit";
import type { TUserData } from "../../types/TUserData";
import { removeFromLocalStorage, storeToLocalStorage } from "../../util/util";


let initialState:TUserData = {
  firstName:'',
     lastName:'',
     profession:'',
     language:'',
     drinking:'',
     pets:'',
     smoking:'',
     education:'',
     preference:'',
     lookingFor:'',
     aboutMe:'',
     height:'',
     aboutThem:'',
      rulesAccepted:false,
     date_of_birth:'',
     hasMatchRequest:false,
     country:'',
     city:'',
     gender:'',
     username:localStorage.getItem('username') || '',
     profileImage:'',
     id:parseInt(localStorage.getItem('id') as string) ||-1,
     postDtoList:[]
}
const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    loginUser: (state,{payload}) => {
      const {username,userId,tokenDto,firstName,lastName,
      } = payload;
      const{token,refreshToken} = tokenDto;
     state.id = userId,
     state.username = username;
     state.firstName = firstName;
     state.lastName = lastName;
  

     //store to local storage
     storeToLocalStorage('username',username)
     storeToLocalStorage('tk',token)
     storeToLocalStorage('rtk',refreshToken)
     storeToLocalStorage('id',userId)

    },
     updateProfileImage: (state,{payload}) => {
      console.log(payload);
      
       state.profileImage=payload
    },
  
    logoutUser: (state) => {
       state.id = -1;
      state.username =''
       removeFromLocalStorage('tk')
       removeFromLocalStorage('rtk')
       removeFromLocalStorage('username')
       removeFromLocalStorage('login')
       removeFromLocalStorage('name')
    },


  }
})
export const { loginUser, logoutUser,updateProfileImage} = userSlice.actions
export default userSlice.reducer
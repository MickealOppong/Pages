import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector, useStore } from "react-redux";
import { authApi } from "./features/api/authApi";
import userSlice from "./features/slice/userSlice";
import utilSlice from "./features/slice/utilSlice";

import { transApi } from "./features/api/transApi";
import { userApi } from "./features/api/userApi";
import sidebarSlice from "./features/slice/sidebarSlice";

export const store = configureStore({
  reducer: {
    userSlice:userSlice,
    sidebarSlice:sidebarSlice,
    utilSlice:utilSlice,
   [authApi.reducerPath]: authApi.reducer,
   [transApi.reducerPath]:transApi.reducer,
   [userApi.reducerPath]:userApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
     {
     
    return getDefaultMiddleware({
      immutableCheck:false,
      serializableCheck: false
    }).concat([authApi.middleware,transApi.middleware,userApi.middleware])

  },
  },)

setupListeners(store.dispatch)

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']


export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()


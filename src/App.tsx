
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorPage, Likes, LoginPage, Messages, PasswordReset, Profile, RegisterPage, Settings, SharedLayout, UserBroadcast, ViewProfile } from './pages/index';
import { store } from './store';


  //loaders
import { ChatRoom } from './components';
import Discover, { loader as discoverLoader } from './pages/Discover';
import { loader as likeLoader } from './pages/Likes';
import { loader as matchLoader } from './pages/Messages';
import { loader as profileLoader } from './pages/Profile';
import { loader as sharedLoader } from './pages/SharedLayout';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { loader as userBroadcastLoader } from './pages/UserBroadcast';
//action



function App() {


  const router = createBrowserRouter([
    {
      path:'',
    element: <LoginPage/>,
      errorElement:<ErrorPage/>,
    },
      {
          index:true,
          element: <LoginPage/>,
          errorElement:<ErrorPage/>
        },
      {
          path:'/landing/',
          element:<SharedLayout/>,
           loader:sharedLoader(store),
          errorElement:<ErrorPage/>,
          children:[
            {
              index:true,
              element:<Discover/>,
              loader:discoverLoader(store),
              errorElement:<ErrorPage/>
            },
             {
              path:'/landing/matches',
              element:<Likes/>,
              loader:likeLoader(store),
              errorElement:<ErrorPage/>
            },
          
                {
              path:'/landing/create-moment',
              element:<UserBroadcast/>,
              loader:userBroadcastLoader(store),
              errorElement:<ErrorPage/>
            },
            {
              path:'/landing/Messages',
              element:<Messages/>,
              loader:matchLoader(store),
              errorElement:<ErrorPage/>,
              shouldRevalidate: ({ currentUrl, nextUrl, formMethod }) => {
                // 1. Force reload if a form mutation just happened (e.g., delete)
                if (formMethod) return true;

                // 2. Force reload on explicit re-navigation (user clicked back to this page from elsewhere)
                if (currentUrl.pathname !== nextUrl.pathname) return true;

                // 3. Otherwise, keep the cache! Do not refetch.
                return false;
              },

            },
            {
              path:'/landing/profile',
              element:<Profile/>,
              loader:profileLoader(store),
              errorElement:<ErrorPage/>
            },
            {
              path:'/landing/settings',
              element:<Settings/>,
              errorElement:<ErrorPage/>
            },
             {
              path:'/landing/view/:id',
              element:<ViewProfile/>,
              errorElement:<ErrorPage/>
            },
               {
                  path:'/chat/:matchId',
                  element:<ChatRoom/>,
                  errorElement:<ErrorPage/>,
                }
             
          ]
        },
     {
          path:'/register',
          element:<RegisterPage/>,
          errorElement:<ErrorPage/>
        },
         {
          path:'/reset',
          element:<PasswordReset/>,
          errorElement:<ErrorPage/>
        },
            {
          path:'/terms',
          element:<TermsAndConditions/>,
          errorElement:<ErrorPage/>
        },
       
  ])
  return  <RouterProvider router={router}/>
}

export default App

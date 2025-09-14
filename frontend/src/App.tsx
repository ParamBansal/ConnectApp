
import {  useEffect } from 'react'
import Home from './components/Home.tsx'
import Login from './components/Login.tsx'
import MainLayout from './components/MainLayout.tsx'
import Signup from './components/Signup.tsx'
import Profile from './components/Profile.tsx'



import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import EditProfile from './components/EditProfile.tsx'
import ChatPage from './components/ChatPage.tsx'
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice.ts'
import { setOnlineUsers } from './redux/chatSlice.ts'
import { setLikeNotification } from './redux/rtnSlice.ts'
import ProtectedRoutes from './components/ProtectedRoutes.tsx'
const browserRouter = createBrowserRouter([{
  path: '/',
  element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
  children: [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/profile/:id',
      element: <ProtectedRoutes><Profile /></ProtectedRoutes>
    },
    {
      path: '/account/edit',
      element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
    },
    {
      path: '/chat',
      element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>
    }
  ]
},
{
  path: '/login',
  element: <Login />
}, {
  path: '/signup',
  element: <Signup />
}])
function App() {
  const { user } = useSelector((store: any) => store.auth);
  const {socket}=useSelector((store:any)=>store.socketio)
  const dispatch=useDispatch();
  useEffect(() => {
    if (user) {
      const socketio = io('https://connectapp-k6fs.onrender.com/login/', {
        query: {
          userId: user?._id
        },
        transports:['websocket']
      });
      dispatch(setSocket(socketio));

      socketio.on('getOnlineUsers',(onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers));
      });
      socketio.on('notification',(notification)=>{
        dispatch(setLikeNotification(notification));
      })
      return ()=>{
        socketio.close();
        dispatch(setSocket(null));
      }
    }
    else if(socket){
      socket?.close();
      dispatch(setSocket(null));

    }
  }, [user,dispatch])

  return (
    <>
    

      <RouterProvider router={browserRouter} />
    </>

  )
}

export default App

import { createSlice } from "@reduxjs/toolkit";

interface Notification {
    type: "like" | "dislike"
    userId: string
    userDetails?: {
      username: string
      profilePicture?: string
    }
  }
  
  interface NotificationState {
    likeNotification: Notification[]
    messageNotification: Notification[]
  }
  
  const initialState: NotificationState = {
    likeNotification: [],
    messageNotification: [],
  }
const rtnSlice=createSlice({
    name:'realTimeNotification',
    initialState,
    reducers:{
        setLikeNotification:(state,action)=>{
            if(action.payload.type=='like'){
                state.likeNotification.push(action.payload);
            }else if(action.payload.type=='dislike'){
                state.likeNotification=state.likeNotification.filter((item)=>item.userId!=action.payload.userId)
            }
        },
        clearLikeNotifications: (state) => {
            state.likeNotification = []
          },
    },
})
export const{setLikeNotification, clearLikeNotifications}=rtnSlice.actions;
export default rtnSlice.reducer
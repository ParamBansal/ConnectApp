
import { createSlice } from "@reduxjs/toolkit"

const authSlice=createSlice({
    name:'auth',
    initialState:{
        user:null,
        suggestedUsers:[],
        userProfile:null,
        selectedUser:null,
        following:[],
        bookmarks:[]
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.user=action.payload;
            const userPayload=action.payload
            if (userPayload) {
                // It now sets `following` AND `bookmarks` from the user object on login
                state.following = userPayload.following || [];
                state.bookmarks = userPayload.bookmarks || [];
            } else {
                // And clears both on logout
                state.following = [];
                state.bookmarks = [];
            }
        },
        setSuggestedUsers:(state,action)=>{
            state.suggestedUsers=action.payload;
        },
        setUserProfile:(state,action)=>{
            state.userProfile=action.payload
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser=action.payload
        },
        setFollowing:(state, action) => {
            
            state.following = action.payload || [];
        },
        setBookmarks:(state, action) => {
            
            state.bookmarks = action.payload || [];
        }
    }
})

export const {setBookmarks,setFollowing,setSelectedUser,setAuthUser,setSuggestedUsers,setUserProfile}=authSlice.actions
export default authSlice.reducer
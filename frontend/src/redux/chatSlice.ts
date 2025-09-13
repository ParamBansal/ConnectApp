import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  text: string;
  createdAt: string;
}

interface ChatState {
  onlineUsers: string[];
  messages: Message[];
}

const initialState: ChatState = {
  onlineUsers: [],
  messages: []
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      // replace entire message list (for loading history)
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      // push a single new message
      state.messages.push(action.payload);
    }
  }
});

export const { setOnlineUsers, setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;

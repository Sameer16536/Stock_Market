import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.id = null;
      state.name = null;
      state.email = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;

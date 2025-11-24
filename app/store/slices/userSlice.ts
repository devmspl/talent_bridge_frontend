import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from '../../types/user';
import Cookies from "js-cookie";

export interface UserState {
  user: UserData | null;
  currentStep: number;
  token: string | null;
  userId: string | null;
}


const initialState: UserState = {
  user: null,
  currentStep: 1,
  token: Cookies.get("tb_token") || null,
  userId: Cookies.get("tb_userId") || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
    },
    updateUserData: (state, action: PayloadAction<Partial<UserData>>) => {
      const current = state.user ?? ({} as UserData);
      state.user = { ...current, ...action.payload } as UserData;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.currentStep = 1;
      Cookies.remove("tb_token");
      Cookies.remove("tb_userId");
      state.token = null;
      state.userId = null;
    },
  },
});

export const { setUser, updateUserData, setCurrentStep, clearUser } = userSlice.actions;
export default userSlice.reducer; 
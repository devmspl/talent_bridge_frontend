import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from '../../types/user';

export interface UserState {
  user: UserData | null;
  currentStep: number;
}

const initialState: UserState = {
  user: null,
  currentStep: 1,
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
    },
  },
});

export const { setUser, updateUserData, setCurrentStep, clearUser } = userSlice.actions;
export default userSlice.reducer; 
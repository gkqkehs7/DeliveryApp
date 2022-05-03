import {createSlice, PayloadAction} from '@reduxjs/toolkit';

//이런건 타입 지정안해주어도 된다 애초에 초기값이 타입이기 때문
//order같은 경우 초기값이 배열이긴하지만, 배열에 무엇이 들어갈지 모르기때문에 타입 지정을 해주는 것이다.
const initialState = {
  name: '',
  email: '',
  accessToken: '',
  money: 0,
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.accessToken = action.payload.accessToken;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setMoney(state, action: PayloadAction<number>) {
      state.money = action.payload;
    },
  },
  extraReducers: builder => {},
});

export default userSlice;

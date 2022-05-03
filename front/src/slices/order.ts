import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Order {
  orderId: string;
  start: {latitude: number; longitude: number};
  end: {latitude: number; longitude: number};
  price: number;
  rider: string;
}

export interface InitialState {
  orders: Order[];
  delieveries: Order[];
}
const initialState: InitialState = {
  orders: [],
  delieveries: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    //payload손 올려놓았을떄 any로 뜨기 때문에 타입을 정의해준다
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
    },
    acceptOrder(state, action: PayloadAction<string>) {
      const Index = state.orders.findIndex(v => v.orderId === action.payload);
      if (Index > -1) {
        state.delieveries.push(state.orders[Index]);
        state.orders.splice(Index, 1);
      }
    },
    rejectOrder(state, action) {
      const Index = state.orders.findIndex(v => v.orderId === action.payload);
      if (Index > -1) {
        state.orders.splice(Index, 1);
      }

      const delivery = state.delieveries.findIndex(
        v => v.orderId === action.payload,
      );

      if (delivery > -1) {
        state.delieveries.splice(delivery, 1);
      }
    },
  },
  extraReducers: builder => {},
});

export default orderSlice;

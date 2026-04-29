import { configureStore } from '@reduxjs/toolkit'
import { globalApi } from '../services/api'
import productReducer from './productSlice'
import orderReducer from './orderSlice'

const store = configureStore({
  reducer: {
    [globalApi.reducerPath]: globalApi.reducer,
    product: productReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(globalApi.middleware),
  devTools: process.env.NODE_ENV !== 'production'
})

export default store
export const useAppDispatch = () => store.dispatch


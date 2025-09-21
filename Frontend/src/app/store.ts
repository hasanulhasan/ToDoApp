import { configureStore } from '@reduxjs/toolkit'
import { todosApi } from '../features/auth/api/todosApi'
// import { todosApi } from '../features/api/todosApi'
import authReducer from '../features/auth/authSlice'


export const store = configureStore({
reducer: {
[todosApi.reducerPath]: todosApi.reducer,
auth: authReducer,
},
middleware: (getDefaultMiddleware) =>
getDefaultMiddleware().concat(todosApi.middleware),
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
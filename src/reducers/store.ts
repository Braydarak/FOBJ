import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import objectReducer from './objectReducer';


const store = configureStore({
  reducer: {
    objects: objectReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

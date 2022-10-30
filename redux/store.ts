import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

import { supporterReducer } from "./supporterSlice";
import { userApi } from "./query/userQuery";

const conReducer = combineReducers({
  supporter: supporterReducer,

  [userApi.reducerPath]: userApi.reducer,
});

const store = configureStore({
  reducer: conReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof conReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;

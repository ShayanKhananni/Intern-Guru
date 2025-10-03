import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import { persistStore } from "redux-persist";

import authReducer from "./auth-slice";
import { todoApi } from "./todo-api-slice";
import { authApi } from "./auth-api-slice";
import { appApi } from "./app-api-slice";


const authPersistConfig = {
  key: 'auth',
  version: 1,
  storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  [todoApi.reducerPath]: todoApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [appApi.reducerPath]: appApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      todoApi.middleware,
      authApi.middleware,
      appApi.middleware,
    ),
  devTools: true,
});

export const persistor = persistStore(store);

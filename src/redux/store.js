import { persistStore, persistCombineReducers } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import storage from 'redux-persist/lib/storage';
import {
  extraDataSlice,
  setReduxStoreLoaded,
} from '@/redux/extraData/extraDataSlice';
import { formDataSlice } from '@/redux/form/formDataSlice';
import { userSlice } from '@/redux/user/userSlice';
import { adminTransactionSlice } from '@/redux/adminTransaction/adminTransactionSlice';
import adminTelegramUserSlice from '@/redux/adminTelegramUser/adminTelegramUserSlice';
import { settingsSlice } from '@/redux/settings/settingsSlice';
import { authSlice } from '@/redux/auth/authSlice';
import adminLinkReducer from '@/redux/adminLink/adminLinkSlice';
import { adminPaymentWithdrawalsSlice } from '@/redux/adminPaymentWithdrawals/adminPaymentWithdrawalsSlice';

const encryptor = encryptTransform({
  secretKey: 'kiml_credit_cards', // Replace with your secret key
  onError: function (error) {
    console.error('Error in encrypting store', error);
    // Handle any encryption errors here
  },
});

const persistConfig = {
  key: 'root', // Change this to your preferred storage key
  storage,
  transforms: [encryptor], // Apply the encryption transformation
  whitelist: [],
};

const rootReducer = persistCombineReducers(persistConfig, {
  [authSlice.name]: authSlice.reducer,
  [extraDataSlice.name]: extraDataSlice.reducer,
  [formDataSlice.name]: formDataSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [adminTransactionSlice.name]: adminTransactionSlice.reducer,
  [adminTelegramUserSlice.name]: adminTelegramUserSlice.reducer,
  [settingsSlice.name]: settingsSlice.reducer,
  [adminPaymentWithdrawalsSlice.name]: adminPaymentWithdrawalsSlice.reducer,
  adminLinks: adminLinkReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  devTools: true,
});

const persistor = persistStore(store, null, () => {
  setTimeout(() => {
    store.dispatch(setReduxStoreLoaded(true));
  }, 500);
});

export { persistor, store };

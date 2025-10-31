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
import { shippingSlice } from '@/redux/shipping/shippingSlice';
import { adminTransactionSlice } from '@/redux/adminTransaction/adminTransactionSlice';
import { topupSlice } from '@/redux/topup/topupSlice';
import { settingsSlice } from '@/redux/settings/settingsSlice';
import { affiliateUserSlice } from '@/redux/affiliateUser/affiliateUserSlice';
import { authSlice } from '@/redux/auth/authSlice';
import { transactionFileSlice } from '@/redux/transactionFile/transactionFileSlice';
import { faqSlice } from '@/redux/faqs/faqSlice';
import { depositSlice } from '@/redux/deposit/depositSlice';
import { payoutSlice } from '@/redux/payout/payoutSlice';
import { chartsSlice } from '@/redux/charts/chartsSlice';

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
  [shippingSlice.name]: shippingSlice.reducer,
  [adminTransactionSlice.name]: adminTransactionSlice.reducer,
  [topupSlice.name]: topupSlice.reducer,
  [settingsSlice.name]: settingsSlice.reducer,
  [affiliateUserSlice.name]: affiliateUserSlice.reducer,
  [transactionFileSlice.name]: transactionFileSlice.reducer,
  [faqSlice.name]: faqSlice.reducer,
  [depositSlice.name]: depositSlice.reducer,
  [payoutSlice.name]: payoutSlice.reducer,
  [chartsSlice.name]: chartsSlice.reducer,
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

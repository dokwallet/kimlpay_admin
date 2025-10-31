import { resetForm } from '@/redux/form/formDataSlice';
import { resetSettings } from '@/redux/settings/settingsSlice';
import { resetShipping } from '@/redux/shipping/shippingSlice';
import { resetTopup } from '@/redux/topup/topupSlice';
import { resetUser } from '@/redux/user/userSlice';
import { replaceRoute } from '@/utils/routing';
import { error } from 'next/dist/build/output/log';
import { resetPreviousRouteParams } from '@/redux/extraData/extraDataSlice';
import { resetAuthData } from '@/redux/auth/authSlice';
import { clearSessionStorage } from '@/utils/sessionStorageData';
import { resetPayout } from '@/redux/payout/payoutSlice';
import { resetCharts } from '@/redux/charts/chartsSlice';

export async function logout(dispatch) {
  try {
    await replaceRoute('/login');
    clearSessionStorage();
    dispatch(resetPreviousRouteParams());
    dispatch(resetForm());
    dispatch(resetSettings());
    dispatch(resetShipping());
    dispatch(resetTopup());
    dispatch(resetPayout());
    dispatch(resetUser());
    dispatch(resetAuthData());
    dispatch(resetCharts());
  } catch (e) {
    error('Something went wrong in logout', e);
  }
}

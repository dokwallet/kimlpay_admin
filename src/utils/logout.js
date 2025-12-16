import { resetForm } from '@/redux/form/formDataSlice';
import { resetSettings } from '@/redux/settings/settingsSlice';
import { resetUser } from '@/redux/user/userSlice';
import { replaceRoute } from '@/utils/routing';
import { error } from 'next/dist/build/output/log';
import { resetPreviousRouteParams } from '@/redux/extraData/extraDataSlice';
import { resetAuthData } from '@/redux/auth/authSlice';
import { clearSessionStorage } from '@/utils/sessionStorageData';

export async function logout(dispatch) {
  try {
    await replaceRoute('/login');
    clearSessionStorage();
    dispatch(resetPreviousRouteParams());
    dispatch(resetForm());
    dispatch(resetSettings());
    dispatch(resetUser());
    dispatch(resetAuthData());
  } catch (e) {
    error('Something went wrong in logout', e);
  }
}

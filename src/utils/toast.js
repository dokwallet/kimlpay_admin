import { toast } from 'react-toastify';

export const showToast = ({ type, error, title, ...options }) => {
  if (options?.toastId) {
    toast.dismiss(options?.toastId);
  }
  if (type === 'progressToast') {
    return toast.loading(title, { autoClose: false });
  } else if (type === 'successToast') {
    return toast.success(title);
  } else if (type === 'warningToast') {
    return toast.warning(title);
  } else if (type === 'errorToast') {
    return toast.error(
      error
        ? error?.response?.data?.details?.toString() ||
            error?.response?.data?.message?.toString() ||
            error?.message
        : title,
    );
  }
};

import toast from "react-hot-toast";

type ToastOptions = {
  description?: string;
  duration?: number;
};

const DEFAULT_DURATION = 3000;

export const notify = {
  success(message: string, options?: ToastOptions) {
    toast.success(message, {
      duration: options?.duration ?? DEFAULT_DURATION,
    });
  },

  error(message: string, options?: ToastOptions) {
    toast.error(message, {
      duration: options?.duration ?? DEFAULT_DURATION,
    });
  },

  info(message: string, options?: ToastOptions) {
    toast(message, {
      duration: options?.duration ?? DEFAULT_DURATION,
    });
  },

  loading(message: string) {
    return toast.loading(message);
  },

  dismiss(id?: string) {
    toast.dismiss(id);
  },
};

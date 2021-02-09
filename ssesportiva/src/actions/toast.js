import { OPEN_TOAST, CLOSE_TOAST } from './actionTypes';

export const openToast = (message) => {
  return { type: OPEN_TOAST, payload: { message } };
};

export const closeToast = () => {
  return { type: CLOSE_TOAST };
};

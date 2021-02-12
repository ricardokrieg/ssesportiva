import { OPEN_TOAST, CLOSE_TOAST } from './actionTypes';

export const openSuccessToast = (title, message) => {
  return { type: OPEN_TOAST, payload: { type: 'success', title, message } };
};

export const openErrorToast = (title, message) => {
  return { type: OPEN_TOAST, payload: { type: 'error', title, message } };
};

export const openDefaultErrorToast = () => {
  return {
    type: OPEN_TOAST,
    payload: { type: 'error', title: 'Erro', message: 'Aconteceu um erro' },
  };
};

export const closeToast = () => {
  return { type: CLOSE_TOAST };
};

import { SIGNIN, SIGNOUT, GET_MEMBER_DETAILS } from './actionTypes';

export const signin = (email, password) => {
  const payload = { email, password };

  return { type: SIGNIN, payload };
};

export const signout = () => {
  return { type: SIGNOUT };
};

export const getMemberDetails = () => {
  return { type: GET_MEMBER_DETAILS };
};

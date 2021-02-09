import React from 'react';
import PropTypes from 'prop-types';
import { isNull } from 'lodash';

const User = ({ auth, user, error }) => {
  if (auth.isEmpty) return null;

  if (error) return <div>{error.message}</div>;

  // TODO loading
  if (isNull(user)) return <div></div>;

  return (
    <div>
      <div>{auth.email}</div>
      <div>{user.status}</div>
      <div>{user.in}</div>
      <div>{user.out}</div>
      <div>{user.commission}</div>
      <div>{user.total}</div>
    </div>
  );
};

User.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object,
  error: PropTypes.object,
};

export default User;

import React from 'react';
import PropTypes from 'prop-types';

const User = ({ auth, user, error }) => {
  if (auth.isEmpty) return null;

  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <div>{auth.email}</div>
      <div>{user && user.status}</div>
    </div>
  );
};

User.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object,
  error: PropTypes.object,
};

export default User;

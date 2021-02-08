import React from 'react';
import PropTypes from 'prop-types';

const Championship = ({ championship }) => {
  return <div>{championship.title}</div>;
};

Championship.propTypes = {
  championship: PropTypes.object.isRequired,
};

export default Championship;

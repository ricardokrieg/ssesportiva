import React from 'react';

const Error = ({ error }) => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div
      className="d-flex flex-column justify-content-center"
      style={{ height: '50vh' }}
    >
      <h1 className="text-danger text-center">{errorMessage}</h1>
    </div>
  );
};

export default Error;

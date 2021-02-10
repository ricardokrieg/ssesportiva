import React from 'react';
import ReactLoading from 'react-loading';

const Loading = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center"
      style={{ height: '50vh' }}
    >
      <ReactLoading
        type="bubbles"
        color="#20A7DB"
        className="align-self-center"
      />
    </div>
  );
};

export default Loading;

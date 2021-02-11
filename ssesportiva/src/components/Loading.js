import React from 'react';
import ReactLoading from 'react-loading';
import { isUndefined } from 'lodash';

const Loading = ({ height }) => {
  if (isUndefined(height)) {
    height = '50vh';
  }

  return (
    <div
      className="d-flex flex-column justify-content-center"
      style={{ height }}
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

import React from 'react';
import { connect } from 'react-redux';
import { Toast } from 'react-bootstrap';

import { closeToast } from '../actions/toast';

const ToastContainer = ({ dispatch, show, title, message }) => {
  return (
    <div style={{ position: 'relative', minHeight: show ? '100px' : '' }}>
      <Toast show={show} onClose={() => dispatch(closeToast())}>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
          <strong className="mr-auto">{title}</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    show: state.toast.show,
    message: state.toast.message,
  };
};

export default connect(mapStateToProps)(ToastContainer);

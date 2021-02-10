import React from 'react';
import { connect } from 'react-redux';
import { Toast } from 'react-bootstrap';

import { closeToast } from '../actions/toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';

const ToastContainer = ({ dispatch, show, message, title, type }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FontAwesomeIcon icon={faCheck} />;
      case 'error':
        return <FontAwesomeIcon icon={faExclamationTriangle} />;
      default:
        return null;
    }
  };

  const getHeader = (type, title) => {
    const bg = type === 'error' ? 'bg-danger' : `bg-${type}`;

    return (
      <Toast.Header
        className={`${bg} text-white d-flex justify-content-between`}
      >
        {getIcon(type)}
        {title}
      </Toast.Header>
    );
  };

  const getBody = (type, message) => {
    const text = type === 'error' ? 'text-danger' : `text-${type}`;

    return <Toast.Body className={`${text} bg-white`}>{message}</Toast.Body>;
  };

  return (
    <div
      className="w-100"
      style={{
        position: 'fixed',
        zIndex: 9999,
        minHeight: show ? '100px' : '',
      }}
    >
      <Toast
        show={show}
        onClose={() => dispatch(closeToast())}
        animation
        autohide
        delay={5000}
        style={{ margin: '0 auto' }}
      >
        {getHeader(type, title)}
        {getBody(type, message)}
      </Toast>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    show: state.toast.show,
    message: state.toast.message,
    title: state.toast.title,
    type: state.toast.type,
  };
};

export default connect(mapStateToProps)(ToastContainer);

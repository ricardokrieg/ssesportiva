import React from 'react';
import ReactLoading from 'react-loading';

const SplashScreen = () => {
  return (
    <div
      className="bg-primary d-flex flex-column justify-content-center"
      style={{ height: '100vh' }}
    >
      <img
        className="align-self-center"
        src="/logo.png"
        width="50%"
        alt="SS eSportiva"
      />
      <ReactLoading type="bubbles" color="#fff" className="align-self-center" />
    </div>
  );
};

export default SplashScreen;

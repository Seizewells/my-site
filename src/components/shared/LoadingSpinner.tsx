import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="box">
        <div className="loader"><span></span></div>
        <div className="loader"><span></span></div>
        <div className="loader"><i></i></div>
        <div className="loader"><i></i></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
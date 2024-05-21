import React, { useState, useEffect } from 'react';
import './LoadingModal.css'; // File CSS untuk styling modal

interface LoadingModalProps {
  isLoading: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isLoading }) => {
  return (
    <div className={`loading-modal ${isLoading ? 'visible' : 'hidden'}`}>
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingModal;

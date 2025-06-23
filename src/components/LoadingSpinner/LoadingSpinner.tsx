import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function LoadingSpinner({ 
  message = "Preparing your meditation space...",
  size = 'medium'
}: LoadingSpinnerProps) {
  return (
    <div className={`loading-container`}>
      <div className={`loading-spinner loading-spinner--${size}`} />
      {message && (
        <p className="loading-message">{message}</p>
      )}
    </div>
  );
}
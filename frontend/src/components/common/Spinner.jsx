import React from 'react';

export function Spinner({ size = 20 }) {
  return (
    <div
      className="spinner"
      style={{
        width: size,
        height: size,
        border: `2px solid var(--border-color)`,
        borderTopColor: 'var(--accent-primary)',
        borderRadius: '50%',
        animation: 'spin 0.6s linear infinite',
      }}
    />
  );
}

export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="loading-overlay">
      <Spinner size={32} />
      <p>{message}</p>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠</div>
      <h3>Something went wrong</h3>
      <p>{message || 'An unexpected error occurred'}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

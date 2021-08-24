import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ percent }) => {
  return (
    <div className="progress-bar-boundary">
      <div style={{ width: `${percent || 0}%` }}>{percent || 0}%</div>
    </div>
  );
};

export default ProgressBar;
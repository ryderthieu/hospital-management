import React from 'react';

type WeCareLoadingProps = {
  mode?: 'fullScreen' | 'parent'; // Default: 'fullScreen'
};

const WeCareLoading: React.FC<WeCareLoadingProps> = ({ mode = 'fullScreen' }) => {
  const containerClass =
    mode === 'fullScreen'
      ? 'flex items-center justify-center min-h-screen bg-white'
      : 'flex items-center justify-center h-full py-8 bg-white';

  return (
    <div className={containerClass}>
      <div className="flex items-center space-x-4">
        {/* Logo WeCare */}
        <div className="text-4xl font-bold">
          <span className="text-base-600 font-bold">We</span>
          <span className="text-black font-bold">Care</span>
        </div>

        {/* Spinning Circle */}
        <div className="relative">
          <div className="w-8 h-8 border-4 border-base-200 border-t-base-600 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default WeCareLoading;

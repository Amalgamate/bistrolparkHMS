import React from 'react';

interface PreloaderProps {
  fullScreen?: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ fullScreen = true }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'fixed inset-0 bg-white z-50' : 'p-8'}`}>
      <div className="relative">
        <img 
          src="/preloader.png" 
          alt="Bristol Park Hospital" 
          className="w-16 h-16 animate-pulse"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-[#2B3990] border-r-[#2B3990] border-b-[#2B3990] border-l-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      <p className="mt-4 text-[#2B3990] font-medium">Loading...</p>
    </div>
  );
};

export default Preloader;

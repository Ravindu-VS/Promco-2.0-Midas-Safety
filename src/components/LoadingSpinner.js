import React from 'react';
import { PuffLoader } from 'react-spinners';  // Correct the import

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <PuffLoader color="#36d7b7" size={100} /> {/* Use PuffLoader */}
    </div>
  );
};

export default LoadingSpinner;

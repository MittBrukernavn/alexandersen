import { useState, useEffect } from 'react';

const getDims = () => {
  const {
    innerWidth: width,
    innerHeight: height,
  } = window;
  return {
    width,
    height,
  };
};

const useWindowDimensions = () => {
  const [dims, setDims] = useState(getDims());

  useEffect(() => {
    const handleResize = () => {
      setDims(getDims());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dims;
};

export default useWindowDimensions;

import React, { useEffect } from 'react'

const preloadImage = (src: string) => {
  const img = new Image();
  img.src = src;  
};

const usePreloadImages= (imageUrls: string[]) => {
  useEffect(() => {
    imageUrls.forEach((url) => preloadImage(url));
  }, [imageUrls]);
}

export default usePreloadImages
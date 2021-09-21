import React, { createContext, useState, useEffect, useRef } from "react";
import axios from 'axios';

export const ImageContext = createContext();
export const ImageProvider = (prop) => {
  const [images, setImages] = useState({});
  const [tempImages, setTempImages] = useState({});
  const [isPublic, setIsPublic] = useState(true);
  const [imageUrl, setImageUrl] = useState(`/images?ispublic=${isPublic}`);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoadLock, setImageLoadLock] = useState(false);
  const pastImageUrl = useRef();

  useEffect(() => {
    if (pastImageUrl.current === imageUrl)
      return;
    if (imageLoadLock)
      return;
    setImageLoading(true);
    axios.get(imageUrl)
      .then(result =>
        isPublic
          ? setImages(prevData => ({ ...prevData, ...result.data }))
          : setTempImages(prevData => ({ ...prevData, ...result.data }))
      )
      .catch(err => setImageError(err))
      .finally(_ => {
        setImageLoading(false);
        pastImageUrl.current = imageUrl;
      });
  }, [imageUrl, imageLoadLock, isPublic]);

  return (
    <ImageContext.Provider
      value={{
        images: isPublic ? images : tempImages,
        setImages,
        setTempImages,
        isPublic,
        setIsPublic,
        imageUrl,
        setImageUrl,
        imageLoading,
        imageError,
        imageLoadLock,
        setImageLoadLock
      }}>
      {prop.children}
    </ImageContext.Provider>
  )
};
import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export const ImageContext = createContext();
export const ImageProvider = (prop) => {
  const [images, setImages] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [imageUrl, setImageUrl] = useState("/images");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [me] = useContext(AuthContext);

  useEffect(() => {
    setImageLoading(true);
    axios.get(imageUrl)
      .then(result => setImages(prevData => [...prevData, ...result.data]))
      .catch(err => setImageError(err))
      .finally(_ => setImageLoading(false));
  }, [imageUrl]);
  useEffect(() => {
    if (me) {
      setTimeout(_ => {
        axios.get("/users/me/images")
          .then(result => setMyImages(result.data))
          .catch(err => console.log(err));
      }, 0)
    } else {
      setMyImages([]);
      setIsPublic(true);
    }
  }, [me]);

  const lastImageId = images.length > 0 ? images[images.length - 1]._id : null;
  const loaderMoreImages = useCallback(() => {
    if (imageLoading || !lastImageId)
      return;
    setImageUrl(`/images?lastid=${lastImageId}`);
  }, [lastImageId, imageLoading]);

  return (
    <ImageContext.Provider
      value={{
        images, setImages,
        myImages, setMyImages,
        isPublic, setIsPublic,
        loaderMoreImages,
        imageLoading,
        imageError
      }}>
      {prop.children}
    </ImageContext.Provider>
  )
};
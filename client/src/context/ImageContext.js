import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export const ImageContext = createContext();
export const ImageProvider = (prop) => {
  const [images, setImages] = useState({});
  const [myImages, setMyImages] = useState({});
  const [isPublic, setIsPublic] = useState(false);
  const [imageUrl, setImageUrl] = useState("/images");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [me] = useContext(AuthContext);
  const pastImageUrl = useRef();

  useEffect(() => {
    if (pastImageUrl.current === imageUrl)
      return;
    setImageLoading(true);
    axios.get(imageUrl)
      .then(result =>
        isPublic
        ? setImages(prevData => ({ ...result.data, ...prevData }))
        : setMyImages(prevData => ({ ...result.data, ...prevData }))
      )
      .catch(err => setImageError(err))
      .finally(_ => {
        setImageLoading(false);
        pastImageUrl.current = imageUrl;
      });
  }, [imageUrl, isPublic]);
  useEffect(() => {
    if (me) {
      setTimeout(_ => {
        axios.get("/users/me/images")
          .then(result => setMyImages(result.data))
          .catch(err => console.log(err));
      }, 0)
    } else {
      setMyImages({});
      setIsPublic(true);
    }
  }, [me]);

  return (
    <ImageContext.Provider
      value={{
        images: isPublic ? images : myImages,
        setImages,
        setMyImages,
        isPublic,
        setIsPublic,
        setImageUrl,
        imageLoading,
        imageError
      }}>
      {prop.children}
    </ImageContext.Provider>
  )
};
import React, { useContext, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ImageContext } from '../context/ImageContext';
import Image from './Image';
import './ImageList.css';

const ImageList = () => {
  const {
    images,
    isPublic,
    setIsPublic,
    setImageUrl,
    imageLoading,
    imageError,
    imageLoadLock
  } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const elementRef = useRef(null);

  const lastImageId = Object.keys(images).length > 0
    ? Object.keys(images)[Object.keys(images).length - 1]
    : null;

  const loaderMoreImages = useCallback(() => {
    if (imageLoadLock || imageLoading || !lastImageId)
      return;
    setImageUrl(`${isPublic ? "" : "users/me"}/images?lastid=${lastImageId}`);
  }, [lastImageId, imageLoading, imageLoadLock, isPublic, setImageUrl]);

  useEffect(() => {
    if (!elementRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting)
        loaderMoreImages();
    });
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [loaderMoreImages]);

  const imgTagList = [];
  Object.values(images).forEach((image, index) => {
    imgTagList.push((<Link
      key={image.key}
      to={`/images/${image._id}`}
      ref={index + 1 === Object.keys(images).length ? elementRef : undefined}
    >
      <Image imageUrl={`http://localhost:5000/uploads/w140/${image.key}`} />
    </Link>));
  })
  return (
    <div>
      <h3
        style={{ display: "inline-block", marginRight: 10 }}
      >
        제휴업체 ({isPublic ? "공개" : "개인"})사진
      </h3>
      {me &&
        <button onClick={() => setIsPublic(!isPublic)}>
          {(isPublic ? "개인" : "공개") + " 사진 보기"}
        </button>}
      <div className="image-list-container">
        {imgTagList}
      </div>
      {imageError && <div>Error...</div>}
      {imageLoading && <div>Loading...</div>}
    </div>
  );
};

export default ImageList;

import React, { useContext, useRef, useEffect, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';

import { ImageContext } from '../context/ImageContext';

import Image from './Image';
import './ImageList.css';

const ImageList = memo(() => {
  const {
    images,
    isPublic,
    setIsPublic,
    setImageUrl,
    imageLoading,
    imageError,
    imageLoadLock
  } = useContext(ImageContext);
  const elementRef = useRef(null);

  const lastImageId = Object.keys(images).length > 0
    ? Object.keys(images)[Object.keys(images).length - 1]
    : null;

  const loaderMoreImages = useCallback(() => {
    if (imageLoading || !lastImageId)
      return;
    setImageUrl(`/images?ispublic=${isPublic}&lastid=${lastImageId}`);
  }, [lastImageId, imageLoading, isPublic, setImageUrl]);

  useEffect(() => {
    if (!elementRef.current)
      return;
    if (imageLoadLock)
      return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting)
        loaderMoreImages();
    });
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [loaderMoreImages, imageLoadLock]);

  const imgTagList = [];
  const maxLength = Object.keys(images).length
  Object.values(images).forEach((image, index) => {
    imgTagList.push((<Link
      key={image.key}
      to={`/images/${image._id}`}
      ref={index + 1 === maxLength
        ? elementRef
        : undefined
      }
    >
      <Image imageUrl={`http://localhost:5000/uploads/w140/${image.key}`} />
    </Link>));
  })
  return (
    <div>
      <h3
        style={{ display: "inline-block", marginRight: 10 }}
      >
        {/* 그해 시간 체크하기 */}
        {isPublic ? "2021" : "한시적 운영"} 제휴업체 사진
      </h3>
      <button onClick={_ => {
        setIsPublic(!isPublic);
        setImageUrl(`/images?ispublic=${!isPublic}`);
      }}>
        {(!isPublic ? "고정 운영" : "한시적 운영") + " 업체 보기"}
      </button>
      <div className="image-list-container">
        {imgTagList}
      </div>
      {imageError && <div>Error...</div>}
      {imageLoading && <div>Loading...</div>}
    </div>
  );
});

export default ImageList;

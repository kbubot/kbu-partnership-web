import React, { useContext } from 'react';
import { ImageContext } from '../context/ImageContext';

const ImageList = () => {
  const [images] = useContext(ImageContext);
  const imgTagList = images.map(image => (
    <img
      alt=""
      key={image.key}
      style={{width: "50%"}}
      src={`http://localhost:5000/uploads/${image.key}`}
    />
  ));
  return (
    <div>
      <h3>제휴업체 이미지</h3>
      {imgTagList}
    </div>
  );
};

export default ImageList;

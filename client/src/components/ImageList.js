import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ImageContext } from '../context/ImageContext';
import './ImageList.css';

const ImageList = () => {
  const { images, myImages, isPublic, setIsPublic } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const imgTagList = (isPublic ? images : myImages).map(image => (
    <Link key={image.key} to={`/images/${image._id}`}>
      <img
        alt=""
        src={`http://localhost:5000/uploads/${image.key}`}
      />
    </Link>
  ));
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
    </div>
  );
};

export default ImageList;

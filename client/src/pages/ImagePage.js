import React, { useContext, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ImageContext } from '../context/ImageContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const ImagePage = () => {
  const history = useHistory();
  const { imageId } = useParams();
  const { images, setImages, setMyImages } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const [hasLiked, setHasLiked] = useState(false);
  const [image, setImage] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    const image = images.find(image => image._id === imageId);
    if (image)
      setImage(image);
  }, [images, imageId])

  useEffect(() => {
    if (image && image._id === imageId)
      return;
    axios.get(`/images/${imageId}`)
      .then(({ data }) => {
        setImage(data);
        setError(false);
      })
      .catch(err => {
        setError(true);
        toast.error(err.response.data.message)
      });
  }, [imageId, image]);

  useEffect(() => {
    if (me && image && image.likes.includes(me.userId))
      setHasLiked(true);
  }, [me, image])
  if (error)
    return <h3>Error...</h3>
  else if (!image)
    return <h3>Loading...</h3>

  const updateImage = (images, image) => [
    ...images.filter(image => image._id !== imageId),
    image
  ].sort((a, b) => {
    if (a._id < b._id) return 1;
    else return -1;
  });
  const onSubmit = async () => {
    const result = await axios.patch(
      `/images/${imageId}/${hasLiked ? "unlike" : "like"}`
    );
    if (result.data.public)
      setImages(prevData => updateImage(prevData, result.data));
    setMyImages(prevData => updateImage(prevData, result.data));
    setHasLiked(!hasLiked);
  };
  const deleteHandler = async () => {
    try {
      if (!window.confirm("정말 해당 이미지를 삭제하시겠습니까?"))
        return;
      const result = await axios.delete(`/images/${imageId}`)
      toast.success(result.data.message);
      setImages(prevData => prevData.filter((image) => image._id !== imageId));
      setMyImages(prevData => prevData.filter((image) => image._id !== imageId));
      history.push("/");
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    /**
     * TODO: private일때 새로고침하면 권한이 없다는 이슈
     * default header sessionid set이 늦어서그런것인가
     */
    <div>
      <h3>이미지: {imageId}</h3>
      <img
        style={{ width: "100%" }}
        alt={imageId}
        src={`http://localhost:5000/uploads/raw/${image.key}`}
      />
      <span>좋아요 {image.likes.length}</span>
      {me && image.user._id === me.userId &&
        <button
          style={{ float: "right", marginLeft: 10 }}
          onClick={deleteHandler}
        >
          삭제
        </button>
      }
      <button
        style={{ float: "right" }}
        onClick={onSubmit}
      >
        {hasLiked ? "좋아요 취소" : "좋아요"}
      </button>
    </div >
  );
};

export default ImagePage;
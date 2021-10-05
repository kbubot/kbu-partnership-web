import React, { useContext, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import { Button } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';

import { ImageContext } from '../context/ImageContext';
import { AuthContext } from '../context/AuthContext';

import UploadForm from '../components/UploadForm';

const { REACT_APP_PROD_SERVER_DOMAIN } = process.env;

const InteractiveBox = _ => {
  const history = useHistory();
  const { imageId } = useParams();
  const { images, setImages, setTempImages } = useContext(ImageContext);
  const [me] = useContext(AuthContext);

  const [image, setImage] = useState();
  const [hasLiked, setHasLiked] = useState(false);
  const [hasEdit, setHasEdit] = useState(false);
  const [error, setError] = useState(false);

  useEffect(_ => {
    const image = images[imageId];
    if (image)
      setImage(image);
  }, [images, imageId])

  useEffect(_ => {
    if (image && image._id === imageId)
      return;
    axios.get(`/images/${imageId}`)
      .then(({ data }) => {
        setImage(data[imageId]);
        setError(false);
      })
      .catch(err => {
        setError(true);
        toast.error(err.response.data.message)
      });
  }, [imageId, image]);

  useEffect(_ => {
    if (me && image && image.likes.includes(me.userId))
      setHasLiked(true);
  }, [me, image])

  const updateImage = (prevImages, updateImage) => ({ ...prevImages, ...updateImage });
  const onSubmit = async _ => {
    const { data } = await axios.patch(
      `/images/${imageId}/${hasLiked ? "unlike" : "like"}`
    );
    if (data[imageId].public)
      setImages(prevData => updateImage(prevData, data));
    else
      setTempImages(prevData => updateImage(prevData, data));
    setHasLiked(!hasLiked);
  };
  const deleteHandler = async _ => {
    try {
      if (!window.confirm("정말 해당 이미지를 삭제하시겠습니까?"))
        return;
      const { data } = await axios.delete(`/images/${imageId}`)
      toast.success(data.message);
      console.log(imageId);
      if (data.result[imageId].public)
        setImages(prevData => {
          const restData = Object.keys(prevData).reduce((acc, key) => {
            if (key !== imageId)
              acc[key] = prevData[key]
            return acc
          }, {})
          return restData
        });
      history.push("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (error)
    return <h3>Error...</h3>
  else if (!image)
    return <h3>Loading...</h3>

  return (
    <>
      <div>
        {me && hasEdit
          ? <UploadForm prevImageId={imageId} />
          :
          <img
            style={{ width: '100%', objectFit: 'cover' }}
            alt={imageId}
            src={`${REACT_APP_PROD_SERVER_DOMAIN}/uploads/w600/${image.key}`}
          />
        }
      </div>
      <span>좋아요 {image.likes.length}</span>
      {me && image.user._id === me.userId
        &&
        <>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{ float: "right", marginLeft: 10 }}
            onClick={deleteHandler}
          >
            <DeleteIcon />
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ float: "right", marginLeft: 10 }}
            onClick={onSubmit}
          >
            {hasLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </Button>
          <Button
            variant="contained"
            color="default"
            size="small"
            style={{ float: "right" }}
            onClick={_ => { setHasEdit(!hasEdit) }}
          >
            <CloudUploadIcon />
          </Button>
        </>
      }
    </>
  )
};

export default InteractiveBox;
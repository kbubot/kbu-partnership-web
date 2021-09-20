import React, { useContext, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import { Button, Divider } from '@material-ui/core';
import { makeStyles, ThemeProvider, unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';

import { ImageContext } from '../context/ImageContext';
import { AuthContext } from '../context/AuthContext';
import InfoForm from '../components/InfoForm';
import UploadForm from '../components/UploadForm';


const theme = unstable_createMuiStrictModeTheme();

const useStyles = makeStyles((theme) => ({
  divider: { margin: theme.spacing(2, 0) },
}));

const ImagePage = () => {
  const classes = useStyles();
  const history = useHistory();
  const { imageId } = useParams();
  const { images, setImages, setTempImages } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasEdit, setHasEdit] = useState(false);
  const [image, setImage] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    const image = images[imageId];
    if (image)
      setImage(image);
  }, [images, imageId])

  useEffect(() => {
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

  useEffect(() => {
    if (me && image && image.likes.includes(me.userId))
      setHasLiked(true);
  }, [me, image])

  if (error)
    return <h3>Error...</h3>
  else if (!image)
    return <h3>Loading...</h3>

  const updateImage = (prevImages, updateImage) => ({ ...prevImages, ...updateImage });

  const onSubmit = async () => {
    const { data } = await axios.patch(
      `/images/${imageId}/${hasLiked ? "unlike" : "like"}`
    );
    if (data[imageId].public)
      setImages(prevData => updateImage(prevData, data));
    else
      setTempImages(prevData => updateImage(prevData, data));
    setHasLiked(!hasLiked);
  };
  const deleteHandler = async () => {
    try {
      if (!window.confirm("정말 해당 이미지를 삭제하시겠습니까?"))
        return;
      const { data } = await axios.delete(`/images/${imageId}`)
      toast.success(data.message);
      setImages(prevData => ({...prevData, ...data}));
      setTempImages(prevData => ({...prevData, ...data}));
      history.push("/");
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    /**
     * private일때 새로고침하면 권한이 없다는 이슈 default header sessionid set이 늦어서그런것인가
     */
    <div>
      <h3>이미지: {imageId}</h3>
      <div
        style={{ maxWidth: 350, margin: 'auto' }}
      >
        {hasEdit ? me && <UploadForm prevImageId={imageId} />
          :
          <img
            style={{ width: '100%', objectFit: 'cover' }}
            alt={imageId}
            src={`http://localhost:5000/uploads/w600/${image.key}`}
          />
        }
      </div>
      <div
        style={{ maxWidth: 350, margin: '20px auto' }}
      >
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
      </div>
      <Divider className={classes.divider} />
      <ThemeProvider theme={theme}>
        <InfoForm />
      </ThemeProvider>
    </div >
  );
};

export default ImagePage;
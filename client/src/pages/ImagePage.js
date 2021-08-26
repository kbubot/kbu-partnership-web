import React, { useContext, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import { Button, Divider } from '@material-ui/core';
import { makeStyles, ThemeProvider, unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DeleteIcon from '@material-ui/icons/Delete';

import { ImageContext } from '../context/ImageContext';
import { AuthContext } from '../context/AuthContext';
import InfoForm from '../components/InfoForm';


const theme = unstable_createMuiStrictModeTheme();

const useStyles = makeStyles((theme) => ({
  divider: { margin: theme.spacing(2, 0) },
}));

const ImagePage = () => {
  const classes = useStyles();
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
     * private일때 새로고침하면 권한이 없다는 이슈 default header sessionid set이 늦어서그런것인가
     */
    <div>
      <h3>이미지: {imageId}</h3>
      <img
        style={{ maxWidth: 350, display: 'block', margin: 'auto' }}
        alt={imageId}
        src={`http://localhost:5000/uploads/w600/${image.key}`}
      />
      <div
        style={{ maxWidth: 350, margin: 'auto', marginBottom: 20 }}
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
              style={{float: "right"}}
              onClick={onSubmit}
            >
              {hasLiked ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
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
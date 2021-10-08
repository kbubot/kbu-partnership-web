import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

import {
  Divider, Button,
  Dialog, DialogContent, DialogActions, DialogTitle
} from '@material-ui/core';
import { ThemeProvider, unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';

import { ImageContext } from '../context/ImageContext';

import UploadForm from './UploadForm';
import CustomInfoForm from './CustomInfoForm';

const theme = unstable_createMuiStrictModeTheme();

const RegisterModal = ({ selected, setSelected }) => {
  const { setImages, setTempImages } = useContext(ImageContext);
  const [files, setFiles] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [percent, setPercent] = useState(0);
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("음식");
  const [benefit, setBenefit] = useState("");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);

  const onSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    for (let file of files)
      formData.append("image", file);
    formData.append("name", name);
    formData.append("category", category);
    formData.append("benefit", benefit);
    formData.append("latitude", lat);
    formData.append("longitude", lon);
    formData.append("public", isPublic);

    await axios({
      url: "/partner/info",
      method: "post",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: e => setPercent(Math.round(100 * e.loaded / e.total))
    })
      .then(({ data }) => {
        if (isPublic)
          setImages(prevData => ({ ...prevData, ...data }));
        else
          setTempImages(prevData => ({ ...prevData, ...data }));
        toast.success("제출 완료!");
      }).catch(err => {
        toast.error(err.response.data.message);
      }).finally(_ => {
        setPercent(0);
        setPreviews([]);
        setIsLoading(false);
      })
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Dialog open={selected} style={{ padding: '10px 0' }}>
          <div style={{ overflow: "hidden" }}>
            <DialogActions style={{ float: "right" }}>
              <Button
                variant="outlined"
                onClick={_ => setSelected(!selected)}
              >닫기</Button>
            </DialogActions>
            <DialogTitle
              style={{ float: "left" }}
            >
              <b>새 제휴업체 등록</b>
            </DialogTitle>
          </div>
          <DialogContent>
            <UploadForm
              value={{
                files, setFiles,
                previews, setPreviews,
                percent, setPercent,
                isPublic, setIsPublic,
                isLoading, setIsLoading
              }}
            />
            <Divider style={{ margin: "20px 0" }} />
            <CustomInfoForm
              value={{
                name, setName,
                category, setCategory,
                benefit, setBenefit,
                lat, setLat,
                lon, setLon
              }}
            />
            <div style={{ overflow: 'hidden' }}>
              <Button
                style={{ float: 'right' }}
                variant="contained"
                color="primary"
                size="small"
                startIcon={<SaveIcon />}
                disabled={isLoading}
                onClick={onSubmit}
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </>
  )
};

export default RegisterModal;
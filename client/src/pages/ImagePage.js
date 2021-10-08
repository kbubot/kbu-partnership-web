import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import { Divider, Button } from '@material-ui/core';
import { ThemeProvider, unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';

import { AuthContext } from '../context/AuthContext';
import CustomInfoForm from '../components/CustomInfoForm';
import InteractiveBox from '../components/InteractiveBox';


const theme = unstable_createMuiStrictModeTheme();

const ImagePage = _ => {
  const { imageId } = useParams(null);
  const [me] = useContext(AuthContext);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("음식");
  const [benefit, setBenefit] = useState("");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);

  useEffect(_ => {
    axios.get(`/partner/info/${imageId}`)
      .then(({ data }) => {
        setName(data.name);
        setCategory(data.category);
        setBenefit(data.benefit);
        setLat(data.location.lat);
        setLon(data.location.lon);
      })
      .catch(err => {
        console.log(err);
      })
  }, [imageId]);

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios({
        url: "/partner/info",
        method: "put",
        data: {
          name, category, benefit, imageId,
          latitude: lat,
          longitude: lon
        }
      });
      toast.success("제출 완료!");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: 'auto', padding: '0 0 20px' }}>
      {imageId && <h3>이미지: {imageId}</h3>}
      <InteractiveBox />
      <Divider style={{ margin: "20px 0" }} />
      <ThemeProvider theme={theme}>
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
          {me &&
            <Button
              style={{ float: 'right' }}
              variant="contained"
              color="primary"
              size="small"
              startIcon={<SaveIcon />}
              onClick={onSubmit}
            >
              Save
            </Button>
          }
        </div>
      </ThemeProvider>
    </div >
  );
};

export default ImagePage;
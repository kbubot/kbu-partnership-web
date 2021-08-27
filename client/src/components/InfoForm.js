import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import { TextField, MenuItem, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';

import { AuthContext } from '../context/AuthContext';


const categoryOptions = [
  { value: '음식', label: '음식' },
  { value: '생활', label: '생활' },
  { value: '여가', label: '여가' }
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: 350,
    margin: 'auto',
    "& > :last-child": { margin: 0 },
    '& > *': { margin: theme.spacing(0, 0, 2, 0) }
  },
  name: { width: '60%' },
  category: { width: '40%' }
}));

const InfoForm = _ => {
  /**
   * propagation error 대비해서 makeStyles는 부모에서만
   */
  const classes = useStyles();
  const [me] = useContext(AuthContext);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("음식");
  const [benefit, setBenefit] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const { imageId } = useParams();

  useEffect(() => {
    axios.get(`/partner/${imageId}`)
      .then(({ data }) => {
        setName(data.name);
        setCategory(data.category);
        setBenefit(data.benefit);
        setLat(data.latitude);
        setLng(data.longitude);
      })
      .catch(err => {
        console.log(err);
      })
  }, [imageId]);

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(
        "/partner",
        { name, category, benefit, imageId, latitude: lat, longitude: lng }
      );
      toast.success("제출 완료!");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <form className={classes.root}>
      <TextField
        label="업체이름"
        className={classes.name}
        required
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <TextField
        label="업체카테고리"
        className={classes.category}
        required
        select
        size="small"
        variant="outlined"
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        {categoryOptions.map((option, index) => (
          <MenuItem value={option.value} key={index}>{option.label}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="업체혜택"
        multiline
        fullWidth
        rows={3}
        variant="outlined"
        value={benefit}
        onChange={e => setBenefit(e.target.value)}
      />
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            label="위도"
            value={lat}
            onChange={e => setLat(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="경도"
            value={lng}
            onChange={e => setLng(e.target.value)}
          />
        </Grid>
      </Grid>
      {me &&
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<SaveIcon />}
          onClick={onSubmit}
        >
          Save
        </Button>
      }
    </form>
  )
}

export default InfoForm;
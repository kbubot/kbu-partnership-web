import React, { memo } from 'react';

import { TextField, MenuItem, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const CATEGORY_OPTIONS = [
  { value: '음식' },
  { value: '생활' },
  { value: '여가' }
]

const useStyles = makeStyles((theme) => ({
  root: {
    "& > :last-child": { margin: 0 },
    '& > *': { margin: theme.spacing(0, 0, 2, 0) }
  },
  name: { width: '60%' },
  category: { width: '40%' }
}));

const CustomInfoForm = memo(({ value }) => {
  const classes = useStyles();
  const {
    name, setName,
    category, setCategory,
    benefit, setBenefit,
    lat, setLat,
    lon, setLon
  } = value;

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
        {CATEGORY_OPTIONS.map((option, index) => (
          <MenuItem value={option.value} key={index}>{option.value}</MenuItem>
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
            value={lon}
            onChange={e => setLon(e.target.value)}
          />
        </Grid>
      </Grid>
    </form>
  )
});

export default CustomInfoForm;
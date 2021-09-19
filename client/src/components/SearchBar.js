import React, { useState, useContext } from 'react';
import axios from "axios";

import { Paper, InputBase, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";

import { ImageContext } from '../context/ImageContext';

const useStyles = makeStyles((theme) => ({
  headline: {
    textAlign: "center",
  },
  logo: {
    width: 140,
    margin: "auto",
    display: "block",
  },
  paper: {
    display: "flex",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
}));

const SearchBar = () => {
  const classes = useStyles();
  const { setImages, setImageLoading } = useContext(ImageContext);
  const [searchKeyword, setSearchKeyword] = useState("");


const onSubmit = async e => {
  e.preventDefault();
  await axios.get(`/partner/search/${searchKeyword}`)
    .then(({ data }) => {
      setImages({ ...data });
      setImageLoading(true);
    });
};

return (
  <div>
    <Paper component="form" className={classes.paper} onSubmit={onSubmit}>
      <InputBase
        className={classes.input}
        onChange={e => setSearchKeyword(e.target.value)}
      />
      <IconButton type="submit">
        <SearchIcon />
      </IconButton>
    </Paper>
  </div>
);
};

export default SearchBar;
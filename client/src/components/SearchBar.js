import React, { useState, useContext, useMemo, useRef, memo } from 'react';
import { toast } from 'react-toastify';
import axios from "axios";

import { Paper, IconButton, InputBase } from "@material-ui/core";
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

const SearchBar = memo(_ => {
  const classes = useStyles();
  const { setImages, setTempImages, setImageLoadLock, setImageUrl, isPublic } = useContext(ImageContext);
  const [searchKeyword, setSearchKeyword] = useState("");
  const confirmSearchKeyword = useRef();

  useMemo(_ => {
    if (!confirmSearchKeyword.current)
      return;
    if (!isPublic)
      axios.get(`/partner/search?keyword=${confirmSearchKeyword.current}&ispublic=${isPublic}`)
        .then(({ data }) => {
          setImageLoadLock(true);
          setTempImages({ ...data });
        })
        .catch(err => toast.error(err.response.data.message));
  }, [isPublic, setImageLoadLock, setTempImages])

  const onSubmit = async e => {
    e.preventDefault();
    await axios.get(
      searchKeyword
        ? `/partner/search?keyword=${searchKeyword}&ispublic=${isPublic}`
        : `/images?ispublic=${isPublic}`
    )
      .then(({ data }) => {
        if (searchKeyword) {
          setImageLoadLock(true);
        } else {
          setImageLoadLock(false);
          setImageUrl(`/images?ispublic=${isPublic}`)
        }
        if (isPublic)
          setImages({ ...data });
        else
          setTempImages({ ...data });
      })
      .catch(err => toast.error(err.response.data.message))
      .finally(_ => confirmSearchKeyword.current = searchKeyword);
  };

  return (
    <>
      <Paper component="form" className={classes.paper} onSubmit={onSubmit}>
        <InputBase
          className={classes.input}
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
        />
        <IconButton type="submit">
          <SearchIcon />
        </IconButton>
      </Paper>
    </>
  );
});

export default SearchBar;
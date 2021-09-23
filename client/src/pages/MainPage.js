import React, { useState } from 'react';

import {
  Divider, Button,
  Dialog, DialogContent, DialogActions, DialogTitle
} from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { ThemeProvider, unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';

import ImageList from '../components/ImageList';
import SearchBar from '../components/SearchBar';
import InfoForm from '../components/InfoForm';
import UploadForm from '../components/UploadForm';

const theme = unstable_createMuiStrictModeTheme();

const MainPage = () => {
  const [selected, setSelected] = useState(false);
  return (
    <>
      <div
        style={{
          margin: "10px 0",
          overflow: "hidden"
        }}
      >
        <h2
          style={{
            display: "inline-block",
            margin: "10px 0",
            float: "left"
          }}
        >한국성서대학교 제휴업체</h2>
        <ToggleButton
          style={{
            float: "right"
          }}
          value="check"
          selected={selected}
          onClick={_ => setSelected(!selected)}
        >
          {selected ? <HighlightOffIcon /> : <ControlPointIcon />}
        </ToggleButton>
      </div>
      <ThemeProvider theme={theme}>
        <Dialog open={selected}>
          <div style={{ overflow: "hidden" }}>
            <DialogActions style={{ float: "right" }}>
              <Button
                variant="outlined"
                onClick={_ => setSelected(!selected)}
              >닫기</Button>
            </DialogActions>
            <DialogTitle style={{ display: "inline-block", float: "left" }}>
              <b>새 제휴업체 등록</b>
            </DialogTitle>
          </div>
          <DialogContent>
            <UploadForm />
            <Divider style={{ margin: "20px 0" }} />
            <InfoForm />
          </DialogContent>
        </Dialog>
      </ThemeProvider>

      <SearchBar />
      <ImageList />
    </>
  );
};

export default MainPage;
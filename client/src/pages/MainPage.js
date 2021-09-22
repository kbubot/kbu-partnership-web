import React, { useState } from 'react';

import { Divider } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab'
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import ImageList from '../components/ImageList';
import SearchBar from '../components/SearchBar';
import InfoForm from '../components/InfoForm';
import UploadForm from '../components/UploadForm';

const MainPage = () => {
  const [selected, setSelected] = useState(false);
  return (
    <>
      <div
        style={{
          width: "100%",
          clear: "both",
          overflow: "auto"
        }}
      >
        <h2
          style={{
            display: "inline-block",
            float: "left"
          }}
        >새 제휴업체 등록</h2>
        <ToggleButton
          style={{
            float: "right",
            verticalAlign: "middle",
            position: "relative",
            top: "50%"
          }}
          value="check"
          selected={selected}
          onChange={_ => setSelected(!selected)}
        >
          {selected ? <HighlightOffIcon /> : <ControlPointIcon />}
        </ToggleButton>
      </div>
      {selected
        ? <div style={{ maxWidth: 350, margin: 'auto' }}>
          <UploadForm />
          <Divider style={{ margin: "20px 0" }} />
          <InfoForm />
        </div>
        : <>
          <SearchBar />
          <ImageList />
        </>
      }
    </>
  );
};

export default MainPage;
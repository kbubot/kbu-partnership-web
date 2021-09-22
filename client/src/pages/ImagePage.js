import React from 'react';
import { useParams } from 'react-router-dom';

import { Divider } from '@material-ui/core';
import { ThemeProvider, unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';

import InfoForm from '../components/InfoForm';
import InteractiveBox from '../components/InteractiveBox';


const theme = unstable_createMuiStrictModeTheme();

const ImagePage = _ => {
  const { imageId } = useParams(null);

  return (
    /**
     * private일때 새로고침하면 권한이 없다는 이슈 default header sessionid set이 늦어서그런것인가
     */
    <div style={{ maxWidth: 350, margin: 'auto' }}>
      {imageId && <h3>이미지: {imageId}</h3>}
      <InteractiveBox />
      <Divider style={{ margin: "20px 0" }} />
      <ThemeProvider theme={theme}>
        <InfoForm />
      </ThemeProvider>
    </div >
  );
};

export default ImagePage;
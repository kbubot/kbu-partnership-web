import React, { memo } from 'react';
import {
  Button,
  Dialog, DialogContent, DialogActions, DialogTitle
} from '@material-ui/core';
import { ThemeProvider, unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';

import UploadForm from './UploadForm';

const theme = unstable_createMuiStrictModeTheme();

const RegisterModal = memo(({ selected, setSelected }) => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Dialog open={selected} style={{ padding: '10px 0' }}>
          <div style={{ overflow: "hidden", width: '350px' }}>
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
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </>
  )
});

export default RegisterModal;
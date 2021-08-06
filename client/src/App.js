import React from 'react';
import UploadForm from './components/UploadForm';
import { ToastContainer } from 'react-toastify';
import ImageList from './components/ImageList';

const App = () => {
  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <ToastContainer />
      <h2 style={{ textAlign: "center" }}>이미지 업로드</h2>
      <UploadForm />
      <ImageList />
    </div>
  );
}

export default App;

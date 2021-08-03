import React from 'react';
import UploadForm from './components/UploadForm';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <h2 style={{ textAlign: "center" }}>이미지 업로드</h2>
      <UploadForm />
    </div>
  );
}

export default App;

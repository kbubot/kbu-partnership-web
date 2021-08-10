import React, { useContext } from 'react';
import UploadForm from '../components/UploadForm';
import ImageList from '../components/ImageList';
import { AuthContext } from '../context/AuthContext';

const MainPage = () => {
  const [me] = useContext(AuthContext);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>이미지 업로드</h2>
      {me && <UploadForm />}
      <ImageList />
    </div>
  );
};

export default MainPage;
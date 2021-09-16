import React, { useContext } from 'react';

import { AuthContext } from '../context/AuthContext';

import UploadForm from '../components/UploadForm';
import ImageList from '../components/ImageList';
import SearchBar from '../components/SearchBar';

const MainPage = () => {
  const [me] = useContext(AuthContext);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>새 제휴업체 등록</h2>
      {me && <UploadForm />}
      <SearchBar />
      <ImageList />
    </div>
  );
};

export default MainPage;
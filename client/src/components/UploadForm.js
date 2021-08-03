import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UploadForm.css'
import ProgressBar from './ProgressBar';

const UploadForm = _ => {
  const defaultFileName = "이미지 파일을 업로드 해주세요.";
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [filename, setFileName] = useState(defaultFileName);
  const [percent, setPercent] = useState(0);
  const [click, setClick] = useState(true);

  const imageSelectHandler = (e) => {
    const imageFile = e.target.files[0];
    setFile(imageFile);
    setFileName(imageFile.name);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile);
    fileReader.onload = e => setImgSrc(e.target.result);
    setImgSrc();
  };
  const onSubmit = async e => {
    /*
      TODO: 텍스트 자료도 같이 보내줘야함.
      TODO: 쓰로틀링 넣어서 중복클릭 없애줘야함.
     */
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    try {
      await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: e => {
          setPercent(Math.round(100 * e.loaded / e.total));
        },
      });
      toast.success("이미지 업로드 성공!");
      setClick(false);
      setTimeout(() => {
        setPercent(0);
        setFileName(defaultFileName);
        setImgSrc(null);
      }, 3000);
    } catch (err) {
      toast.error(err.message);
      setPercent(0);
      setFileName(defaultFileName);
      setImgSrc(null);
      console.error(err);
    }
  }
  return (
    <form className="file-sender" onSubmit={onSubmit}>
      <img
        className={`image-preview ${imgSrc && "image-preview-show"}`}
        src={imgSrc}
        alt=""
      />
      <ProgressBar percent={percent} />
      <div className="file-dropper">
        {filename}
        <input id="image" type="file" accept="image/*"
          onChange={imageSelectHandler}
        />
      </div>
      <button type="submit" disabled={!click}>제출</button>
    </form>
  )
}

export default UploadForm;
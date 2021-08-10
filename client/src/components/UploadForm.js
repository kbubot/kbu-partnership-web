import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UploadForm.css'
import ProgressBar from './ProgressBar';
import { ImageContext } from '../context/ImageContext';

const UploadForm = _ => {
  const { images, setImages, myImages, setMyImages } = useContext(ImageContext);
  const defaultFileName = "이미지 파일을 업로드 해주세요.";
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [filename, setFileName] = useState(defaultFileName);
  const [percent, setPercent] = useState(0);
  const [click, setClick] = useState(true);
  const [isPublic, setIsPublic] = useState(true);

  const imageSelectHandler = (e) => {
    const imageFile = e.target.files[0];
    setFile(imageFile);
    /**
     * TODO: 이미지가 선택되지 않았는데 제출을 눌렀을 경우 에러 처리해야함
     */
    setFileName(imageFile.name);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile);
    fileReader.onload = e => setImgSrc(e.target.result);
    setImgSrc();
  };
  const onSubmit = async e => {
    /**
     * TODO: 텍스트 자료도 같이 보내줘야함.
     */
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    formData.append("public", isPublic);
    try {
      const res = await axios.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: e => {
          setPercent(Math.round(100 * e.loaded / e.total));
        },
      });
      if (isPublic)
        setImages([...images, res.data]);
      else
        setMyImages([...myImages, res.data]);

      toast.success("이미지 업로드 성공!");
      setClick(false);
      setTimeout(() => {
        setPercent(0);
        setFileName(defaultFileName);
        setImgSrc(null);
      }, 3000);
    } catch (err) {
      toast.error(err.response.data.message);
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
      <input
        type="checkbox"
        id="public-check"
        value={isPublic}
        onChange={e => { setIsPublic(!isPublic) }}
      />
      <label htmlFor="public-check">비공개</label>
      <button type="submit" disabled={!click}>제출</button>
    </form>
  )
}

export default UploadForm;
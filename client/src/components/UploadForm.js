import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UploadForm.css'
import ProgressBar from './ProgressBar';
import { ImageContext } from '../context/ImageContext';

const UploadForm = _ => {
  const { setImages, setMyImages } = useContext(ImageContext);
  const [files, setFiles] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [percent, setPercent] = useState(0);
  const [isPublic, setIsPublic] = useState(true);
  const inputRef = useRef();

  const imageSelectHandler = async (e) => {
    /**
     * TODO: 이미지가 선택되지 않았는데 제출을 눌렀을 경우 에러 처리해야함
     */
    const imageFiles = e.target.files;
    setFiles(imageFiles);

    const imagePreviews = await Promise.all(
      [...imageFiles].map(imageFile => {
        return new Promise((resolve, reject) => {
          try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(imageFile);
            fileReader.onload = e => resolve({
              imgSrc: e.target.result,
              fileName: imageFile.name
            });
          } catch (err) {
            reject(err);
          }
        });
      })
    );
    setPreviews(imagePreviews);
  };
  const onSubmit = async e => {
    /**
     * TODO: 텍스트 자료도 같이 보내줘야함.
     */
    e.preventDefault();
    const formData = new FormData();
    for (let file of files)
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
        setImages(prevData => [...res.data, ...prevData]);
      setMyImages(prevData => [...res.data, ...prevData]);
      toast.success("이미지 업로드 성공!");
      setTimeout(() => {
        setPercent(0);
        setPreviews([]);
        inputRef.current.value = null;
      }, 3000);
    } catch (err) {
      toast.error(err.response.data.message);
      setPercent(0);
      setPreviews([]);
      console.error(err);
    }
  }
  const previewImages = previews.map((preview, index) => (
    <img
      key={index}
      style={{ width: 200, height: 200, objectFit: 'cover' }}
      src={preview.imgSrc}
      alt=""
      className={`image-preview ${preview.imgSrc && "image-preview-show"}`}
    />
  ));
  const fileName = previews.length === 0 ?
    "이미지 파일을 업로드 해주세요." :
    previews.reduce((previous, current) => previous + ` ${current.fileName}`, "");
  return (
    <form className="file-sender" onSubmit={onSubmit}>
      <div style={{
        display: "flex",
        flexWrap: "wrap"
      }}>
        {previewImages}
      </div>
      <ProgressBar percent={percent} />
      <div className="file-dropper">
        {fileName}
        <input
          ref={ref => inputRef.current = ref}
          id="image"
          type="file"
          accept="image/*"
          multiple
          onChange={imageSelectHandler}
        />
      </div>
      <input
        type="checkbox"
        id="public-check"
        value={isPublic}
        onChange={_ => { setIsPublic(!isPublic) }}
      />
      <label htmlFor="public-check">비공개</label>
      <button type="submit">제출</button>
    </form>
  )
}

export default UploadForm;
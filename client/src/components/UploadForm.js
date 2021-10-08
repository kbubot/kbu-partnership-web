import React, { useRef } from 'react';

import 'react-toastify/dist/ReactToastify.css';
import './UploadForm.css'

import ProgressBar from './ProgressBar';


const UploadForm = ({ value }) => {
  const {
    setFiles,
    previews, setPreviews,
    percent,
    isPublic, setIsPublic,
    setIsLoading
  } = value;

  const inputRef = useRef(null);

  const imageSelectHandler = async (e) => {
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
    setIsLoading(false);
  };

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
    <form className="file-sender">
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
        id="temporary-check"
        value={isPublic}
        onChange={_ => { setIsPublic(!isPublic) }}
      />
      <label htmlFor="temporary-check">한시적 운영 업체</label>
    </form >
  )
}

export default UploadForm;
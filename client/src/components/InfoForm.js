import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CustomInput from '../components/CustomInput';
import { toast } from 'react-toastify';
import axios from 'axios';

const InfoForm = _ => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("음식");
  const [benefit, setBenefit] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const { imageId } = useParams();

  useEffect(() => {
    /** 
    * db에서 불러온게 없을시 에러처리 할 수 없나?
    */
    axios.get(`/partner/${imageId}`)
      .then(({data}) => {
        setName(data.name);
        setCategory(data.category);
        setBenefit(data.benefit);
        setLat(data.latitude);
        setLng(data.longitude);
    })
      .catch(err => {
        console.log(err);
      })
  }, [imageId]);

  const onSubmit = async e => { 
    e.preventDefault();
    try{      
      await axios.put(
        "/partner",
        {name, category, benefit, imageId, latitude: lat, longitude: lng}
      );
      toast.success("제출 완료!");
    }catch(err){
      toast.error(err.response.data.message);
    }
  };
  return (
    <form style={{
      marginTop: 100,
      maxWidth: 350,
      margin: 'auto'
    }}>
        <CustomInput label="업체이름" value={name} setValue={setName}/>
        <label htmlFor="category">업체카테고리</label>
        <select 
          id="category" 
          style={{float:"right"}}
          value={category}
          onChange={setCategory}
        >
          <option value="음식">음식</option>
          <option value="생활">생활</option>
          <option value="여가">여가</option>
        </select>
        <CustomInput label="업체혜택"value={benefit} setValue={setBenefit}/>
        <CustomInput label="위도" value={lat} setValue={setLat} type="number"/>
        <CustomInput label="경도" value={lng} setValue={setLng} type="number"/>
        <button type="submit" onClick={onSubmit}>제출</button>
    </form>
  )
}

export default InfoForm;
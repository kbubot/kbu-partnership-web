import React, { useState, useEffect, useContext } from 'react';
import { ToggleButton } from '@material-ui/lab';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import { AuthContext } from '../context/AuthContext';

import MainContent from '../components/MainContent';
import SearchBar from '../components/SearchBar';
import RegisterModal from '../components/RegisterModal';

const MainPage = _ => {
  const [selected, setSelected] = useState(false);
  const [me] = useContext(AuthContext);

  useEffect(_ => {
    return _ => setSelected(false);
  }, []);
  return (
    <>
      <div
        style={{
          margin: "10px 0",
          overflow: "hidden"
        }}
      >
        <h2
          style={{
            display: "inline-block",
            margin: "10px 0",
            float: "left"
          }}
        >한국성서대학교 제휴업체</h2>
        {me && <ToggleButton
          style={{
            float: "right"
          }}
          value="check"
          selected={selected}
          onClick={_ => setSelected(!selected)}
        >
          {selected ? <HighlightOffIcon /> : <ControlPointIcon />}
        </ToggleButton>}
      </div>
      <RegisterModal selected={selected} setSelected={setSelected} />
      <SearchBar />
      <MainContent />
    </>
  );
};

export default MainPage;
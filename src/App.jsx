
import Foryou from "./components/Foryou"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Toptracks from "./components/Toptracks"
import Layout from "./components/Layout";
import { useState } from "react";
const getGradientForSong = (song) => {
  const gradientColors = [
    "linear-gradient(to right, #3a3a3a, #6a6a6a)",
    "linear-gradient(to right, #2c2c2c, #4a4a4a)",
    "linear-gradient(to right, #1c1c1c, #3a3a3a)",
    "linear-gradient(to right, #0c0c0c, #2a2a2a)",
    "linear-gradient(to right, #0a0a0a, #1a1a1a)"
  ];
  return gradientColors[song.id % gradientColors.length];
};


const App = () => {

  const [curSong, setCurentSong] = useState(null);

  const backgroundColor = curSong
    ? getGradientForSong(curSong)
    : "linear-gradient(to right, #000000, #434343)";

  return (
    <div>
<BrowserRouter>
      {/* <Layout backgroundColor={backgroundColor} /> */}
      <Routes>
        <Route path="/" element={<Foryou setCurentSong={setCurentSong} />} />
        <Route path="/top" element={<Toptracks />} />


      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

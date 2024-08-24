import { useEffect, useRef, useState } from "react";
import "../index.css";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import FontAwesome CSS
import Layout from "./Layout";

const Foryou = ({setCurentSong}) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [durations, setDurations] = useState({});
  const [isPlaying, setIsplaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsmuted] = useState(false);
  const audioRef = useRef(new Audio());


  const handleSongChange = (song) => {
    setCurentSong(song)
  }

  useEffect(() => {
    const exampe = {id: 1};
    handleSongChange(exampe)
  }, [setCurentSong])

  const handleVolumeToggle = () => {
    setIsmuted((prev) => !prev);
    audioRef.current.muted = !audioRef.current.muted;
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    fetch("https://cms.samespace.com/items/songs")
      .then((res) => res.json())
      .then((da) => {
        if (Array.isArray(da.data)) {
          setData(da.data);
          getDurations(da.data);
        } else {
          console.log("Expected an array but got:", da);
          setData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);

  const getDurations = (songs) => {
    songs.forEach((song) => {
      const audio = new Audio(song.url);
      audio.addEventListener("loadedmetadata", () => {
        setDurations((prev) => ({ ...prev, [song.id]: audio.duration }));
      });
    });
  };

  useEffect(() => {
    if (currentSong) {
      audioRef.current.src = currentSong.url;
      audioRef.current.muted = isMuted;

      const handleTimeUpdate = () =>
        setCurrentTime(audioRef.current.currentTime);
      const handleEnded = () => handleNextSong();

      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current.duration);
      });

      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("ended", handleEnded);
    }

    audioRef.current
      .play()
      .then(() => setIsplaying(true))
      .catch((error) => console.log(error));

    return () => {
      audioRef.current.pause();
      // audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      // audioRef.current.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]);

  const togglePalyPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.log(error);
      });
    }
    setIsplaying((prev) => !prev);
  };

  const handlePrevSong = () => {
    const currentIndex = data.findIndex((song) => song.id === currentSong.id);
    if (currentIndex > 0) {
      setCurrentSong(data[currentIndex - 1]);
    }
  };

  const handleNextSong = () => {
    const currentIndex = data.findIndex((song) => song.id === currentSong.id);
    if (currentIndex < data.length - 1) {
      setCurrentSong(data[currentIndex + 1]);
    }
  };

  const handleSongClick = (song) => {
    if (currentSong && currentSong.id === song.id) {
      togglePalyPause();
    } else {
      setCurrentSong(song);
      setIsplaying(true);
      audioRef.current.src = song.url;
      audioRef.current.muted = isMuted;
      audioRef.current
        .play()
        .catch((error) => console.log("Error playing the song", error));
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const filterSongs = data.filter(
    (item) =>
      (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
      (item.artist && item.artist.toLowerCase().includes(search.toLowerCase()))
  );

  const gradientColors = [
    "linear-gradient(to right, #232526, #414345)",  // Dark gray to slightly lighter gray
    "linear-gradient(to right, #373b44, #4286f4)",  // Dark charcoal to muted blue
    "linear-gradient(to right, #0f2027, #203a43, #2c5364)",  // Very dark teal to deep blue-gray
    "linear-gradient(to right, #2b5876, #4e4376)",  // Deep blue to dark violet
    "linear-gradient(to right, #1e3c72, #2a5298)",
  ]

  const getGradientForSong = (song) => {
    // Cycle through gradients or map specific songs to gradients
    return gradientColors[song.id % gradientColors.length];
  };

  return (
  <div>
<div>
  
    <Layout backgroundColor={currentSong
        ? getGradientForSong(currentSong)
        : "linear-gradient(to right, #000000, #434343)"
      } />
      </div>
    <div
      className="main-container"
      style={{
        background: currentSong
        ? getGradientForSong(currentSong)
        : "linear-gradient(to right, #000000, #434343)",
      }}
    >
      
      <div className="songs-list" >
        <div className="search-container">
          <input style={{
                background: currentSong
                ? getGradientForSong(currentSong)
                : "linear-gradient(to right, #000000, #434343)",
              }}
            className="input-filed"
            type="text"
            value={search}
            onChange={handleChange}
            placeholder="Search song, Artist"
          />
          <i className="fas fa-search search-icon"></i>
        </div>

        <div className="song-list" >
          <ul >
            {filterSongs.map((item, index) => (
              <li style={{
                background: currentSong
                ? getGradientForSong(currentSong)
                : "linear-gradient(to right, #000000, #434343)",
              }}
                key={index}
                className="song-item"
                onClick={() => handleSongClick(item)}
              >
                <img
                  src={`https://cms.samespace.com/assets/${item.cover}`}
                  alt={item.name}
                />
                <div className="song-info">
                  <div className="song-title">{item.name}</div>
                  <div className="song-artist">{item.artist}</div>
                </div>
                <div className="song-duration">
                  {durations[item.id]
                    ? formatDuration(durations[item.id])
                    : "Loading..."}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="playing-container" style={{
        background: currentSong
        ? getGradientForSong(currentSong)
        : "linear-gradient(to right, #000000, #434343)",
      }}>
        {currentSong && (
          <>
            <div className="current-song">
              <div className="current-song-title">{currentSong.name}</div>
              <div className="current-song-artist">{currentSong.artist}</div>
              <img
                src={`https://cms.samespace.com/assets/${currentSong.cover}`}
                alt={currentSong.name}
                className="current-song-cover"
              />
            </div>
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="controls">
              <h2
                style={{
                  paddingBottom: "0px",
                  paddingRight: "0px",
                  marginRight: "0px",
                  // backgroundColor:"#4656ed"
                }}
              >
                <i className="fas fa-ellipsis-h"></i>
              </h2>
              <button onClick={handlePrevSong} className="prev">
                <i className="fas fa-step-backward"></i>
              </button>
              <button onClick={togglePalyPause} className="prev">
                <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
              </button>
              <button className="prev" onClick={handleNextSong}>
                <i className="fas fa-step-forward"></i>
              </button>
              <button className="control-button" onClick={handleVolumeToggle}>
                <i
                  className={`fas ${
                    isMuted ? "fa-volume-mute" : "fa-volume-up"
                  }`}
                ></i>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </div>
  );
};

export default Foryou;

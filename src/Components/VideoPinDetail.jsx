import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Image,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverFooter,
  ButtonGroup,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoHome, IoPause, IoPlay, IoTrash } from "react-icons/io5";
import { Dna } from "react-loader-spinner";
import { deleteVideo, getSpecificVideo, getUserInfo, recommendedFeed } from "../utils/fetchData";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "../firebase-config";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import {
  MdOutlineReplay10,
  MdForward10,
  MdVolumeUp,
  MdVolumeOff,
  MdFullscreen,
} from "react-icons/md";
import HTMLReactParser from "html-react-parser";
import { FcApproval } from "react-icons/fc";
import moment from "moment";
import { fetchUser } from "../utils/fetchUser";
import RecommendedVideos from "./RecommendedVideos";

const firestoreDb = getFirestore(firebaseApp);

const format = (seconds) => {
  if (isNaN(seconds)) {
    return "00:00";
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");

  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")} : ${ss}`;
    // 01:02:32
  }

  return `${mm}:${ss}`;
  // 02:35
};

const VideoPinDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [localUser] = fetchUser();
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [feeds, setFeeds] = useState(null);

  // custom reference
  const playerRef = useRef();
  const playerContainer = useRef();

  const handleFastRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handleProgress = (changeState) => {
    if (!seeking) {
      setPlayed(parseFloat(changeState.played / 100) * 100);
    }
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e / 100));
  };

  const onSeekMouseDown = (e) => {
    setSeeking(true);
  };

  const onSeekMouseUp = (e) => {
    setSeeking(false);
    playerRef.current.seekTo(e / 100);
  };

  const currentTime = playerRef.current
    ? playerRef.current.getCurrentTime()
    : "00:00";

  const duration = playerRef.current
    ? playerRef.current.getDuration()
    : "00:00";

  const elapsedTime = format(currentTime);
  const totalDuration = format(duration);
  const avatar =
    "https://ak.picdn.net/contributors/3038285/avatars/thumb.jpg?t=5636611";

   const deleteTheVideo = (videoId) => {
     setIsLoading(true);
     deleteVideo(firestoreDb, videoId);
     navigate("/", { replace: true });
   };

  useEffect(() => {
    if (params.videoID) {
      setIsLoading(true);
      getSpecificVideo(firestoreDb, params.videoID).then((data) => {
        console.log("Fetched video info:", data);
        setVideoInfo(data);
        recommendedFeed(firestoreDb, data.category, params.videoID).then((feed) => {
          setFeeds(feed)
        }).catch((error) => {console.log(error);})
        getUserInfo(firestoreDb, data.userId)
          .then((user) => {
            setUserInfo(user);
          })
          .catch((error) => {
            console.log(error);
          });
        setIsLoading(false);
      });
    }
  }, [params.videoID]);

  useEffect(() => {}, [muted, volume]);

  if (isLoading || !videoInfo) {
    return (
      <div className="flex w-full justify-center items-center h-full">
        {/* Center the DNA loader using flex */}
        <Dna height={180} width={180} color="#00BFFF" />
      </div>
    );
  }

  const onvolumechange = (e) => {
    setVolume(parseFloat(e / 100));
    console.log(volume);

    e === 0 ? setMuted(true) : setMuted(false);
  };

  return (
    <div className="flex flex-col w-full h-auto justify-center items-center py-2">
      <div className="flex items-center w-full my-4">
        <Link to={"/"}>
          <IoHome fontSize={25} />
        </Link>
        <div className="w-px h-[20px] bg-gray-500 mx-2"></div>
        <p className="font-semibold w-[100%]">{videoInfo?.title}</p>
      </div>
      {/* Main grid for video  */}
      <div className="grid grid-cols-3 gap-2 w-[100%]">
        <div className="w-[100%] col-span-3 sm:col-span-2">
          <div
            className="flex w-full bg-black sticky sm:relative top-20 sm:top-0 left-0 z-10"
            ref={playerContainer}
          >
            <ReactPlayer
              ref={playerRef}
              url={videoInfo?.videoUrl}
              width="100%"
              height={"100%"}
              playing={isPlaying}
              muted={muted}
              volume={volume}
              onProgress={handleProgress}
            />
            {/* Controls for video player  */}
            <div className="flex flex-col absolute top-0 left-0 right-0 bottom-0 justify-between items-center z-10 cursor-pointer">
              {/* play icon  */}
              <div
                className="flex items-center justify-center w-full h-full"
                onClick={() => {
                  setIsPlaying(!isPlaying);
                }}
              >
                {!isPlaying && (
                  <IoPlay fontSize={60} color="#f2f2f2" cursor={"pointer"} />
                )}
              </div>
              {/* Mobile view progress control  */}
              <div className="sm:hidden w-full bg-black h-16 ">
                <div className="w-full bg-gradient-to-t from-blackAlpha-900 via-blackAlpha-500 to-blackAlpha-50 p-2 px-2">
                  {/* Add padding for the slider({state.x}) */}
                  <Slider
                    aria-label="slider-ex-4"
                    min={0}
                    max={100}
                    value={played * 100}
                    transition="ease-in-out"
                    transitionDuration={"0.2"}
                    onChange={handleSeekChange}
                    onMouseDown={onSeekMouseDown}
                    onChangeEnd={onSeekMouseUp}
                  >
                    <SliderTrack bg="teal.50">
                      <SliderFilledTrack bg="teal.300" />
                    </SliderTrack>
                    <SliderThumb
                      boxSize={3}
                      bg="teal.300"
                      transition="ease-in-out"
                      transitionDuration={"0.2"}
                    />
                  </Slider>
                  {/* Other player controls */}
                  <div className="w-full flex items-center justify-between">
                    <div className="flex gap-4">
                      <MdOutlineReplay10
                        fontSize={10}
                        color="#f1f1f1"
                        cursor="pointer"
                        onClick={handleFastRewind}
                      />
                      {/* Play and pause button */}
                      <div
                        className=""
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {!isPlaying ? (
                          <IoPlay
                            fontSize={10}
                            color="#f2f2f2"
                            cursor="pointer"
                          />
                        ) : (
                          <IoPause
                            fontSize={10}
                            color="#f2f2f2"
                            cursor="pointer"
                          />
                        )}
                      </div>
                      <MdForward10
                        fontSize={10}
                        color="#f1f1f1"
                        cursor="pointer"
                        onClick={handleFastForward}
                      />
                    </div>
                    <div className="flex gap-2 text-white text-sm">
                      <p className="color-white">{elapsedTime}</p>
                      <p className="color-white">/</p>
                      <p className="color-white">{totalDuration}</p>
                    </div>
                    <MdFullscreen
                      fontSize={10}
                      color="f1f1f1"
                      cursor="pointer"
                      onClick={() => {
                        screenfull.toggle(playerContainer.current);
                      }}
                    />
                  </div>
                  {/* Mobile duration display */}
                </div>
              </div>

              {/* progress control  */}
              <div className="hidden sm:flex w-full py-2">
                <div className="flex flex-col w-full items-center px-4 bg-gradient-to-t from-blackAlpha-900 via-blackAlpha-500 to-blackAlpha-50">
                  {/* Add padding for the slider({state.x}) */}
                  <Slider
                    aria-label="slider-ex-4"
                    min={0}
                    max={100}
                    value={played * 100}
                    transition="ease-in-out"
                    transitionDuration={"0.2"}
                    onChange={handleSeekChange}
                    onMouseDown={onSeekMouseDown}
                    onChangeEnd={onSeekMouseUp}
                  >
                    <SliderTrack bg="teal.50">
                      <SliderFilledTrack bg="teal.300" />
                    </SliderTrack>
                    <SliderThumb
                      boxSize={3}
                      bg="teal.300"
                      transition="ease-in-out"
                      transitionDuration={"0.2"}
                    />
                  </Slider>
                  {/* Other player controls  */}
                  <div className="flex w-[100%] items-center gap-10 mt-2">
                    <MdOutlineReplay10
                      fontSize={30}
                      color="#f1f1f1"
                      cursor="pointer"
                      onClick={handleFastRewind}
                    />
                    {/* Play and pause button  */}
                    <div className="" onClick={() => setIsPlaying(!isPlaying)}>
                      {!isPlaying ? (
                        <IoPlay
                          fontSize={30}
                          color="#f2f2f2"
                          cursor="pointer"
                        />
                      ) : (
                        <IoPause
                          fontSize={30}
                          color="#f2f2f2"
                          cursor="pointer"
                        />
                      )}
                    </div>
                    <MdForward10
                      fontSize={30}
                      color="#f1f1f1"
                      cursor="pointer"
                      onClick={handleFastForward}
                    />
                    {/* Volume Controls   */}
                    <div className="flex items-center">
                      <div
                        className=""
                        onClick={() => {
                          setMuted(!muted);
                        }}
                      >
                        {!muted ? (
                          <MdVolumeUp
                            fontSize={30}
                            color="#f1f1f1"
                            cursor="pointer"
                          />
                        ) : (
                          <MdVolumeOff
                            fontSize={30}
                            color="#f1f1f1"
                            cursor="pointer"
                          />
                        )}
                      </div>
                      <Slider
                        aria-label="slider-ex-1"
                        defaultValue={volume * 100}
                        min={0}
                        max={100}
                        size="sm"
                        width={16}
                        mx={2}
                        onChangeStart={onvolumechange}
                        onChangeEnd={onvolumechange}
                      >
                        <SliderTrack bg="teal.50">
                          <SliderFilledTrack bg="teal.300" />
                        </SliderTrack>
                        <SliderThumb boxSize={2} bg="teal.300" />
                      </Slider>
                      {/* duration of video  */}
                      <div className="flex items-center gap-2 ml-10">
                        <p className="color-white">{elapsedTime}</p>
                        <p className="color-white">/</p>
                        <p className="color-white">{totalDuration}</p>
                      </div>
                    </div>
                    <h1 className="w-[180px] font-bold text-2xl ml-auto text-white">
                      Stream Verse
                    </h1>
                    <MdFullscreen
                      fontSize={30}
                      color="f1f1f1"
                      cursor="pointer"
                      onClick={() => {
                        screenfull.toggle(playerContainer.current);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Mobile view account and deleteing buttons  */}
          <div className="flex sm:hidden justify-around mt-6 text-green-600">
            {userInfo?.uid === localUser.uid && (
              <Popover closeOnEsc>
                <PopoverTrigger>
                  <Button colorScheme={"red"}>
                    <IoTrash fontSize={20} color="#fff" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Confirmation!</PopoverHeader>
                  <PopoverBody>Are you sure you want to delete it?</PopoverBody>

                  <PopoverFooter d="flex" justifyContent="flex-end">
                    <ButtonGroup size="sm">
                      <Button
                        colorScheme="red"
                        onClick={() => deleteTheVideo(params.videoID)} // Corrected property name
                      >
                        Yes
                      </Button>
                    </ButtonGroup>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
            )}
            <a
              href={videoInfo.videoUrl}
              download
              onClick={(e) => e.stopPropagation()}
            >
              <button className="rounded-full my-2 mt-0 bg-green-400 text-white font-semibold px-5 py-2 hover:bg-green-500">
                Free Download
              </button>
            </a>
          </div>
          {/* Video Description  */}
          {videoInfo?.description && (
            <div className="flex flex-col my-6">
              <p className="my-2 text-2xl font-semibold">Description</p>
              {HTMLReactParser(videoInfo?.description)}
            </div>
          )}
          {feeds && (
              <div className="flex sm:hidden flex-col w-full my-6">
                <p className="my-4 text-xl font-semibold">Recommended Videos</p>
                <RecommendedVideos feeds={feeds} />
              </div>
            )}
        </div>
        <div className="hidden sm:flex ml-5">
          <div className="w-[100%] col-span-1">
            {userInfo && (
              <div className="flex flex-col w-full">
                <div className="flex items-center w-full">
                  <Image
                    src={userInfo?.photoURL ? userInfo?.photoURL : avatar}
                    className="w-16 h-16 rounded-full mt-[-30px] border-2"
                  />
                  <div className="flex flex-col ml-3">
                    <div className="flex items-center">
                      <p className="font-semibold text-base truncate">
                        {userInfo?.displayName}
                      </p>
                      <FcApproval className="ml-1" />
                    </div>
                    {videoInfo?.id && (
                      <p className="text-base">
                        {moment(
                          new Date(parseInt(videoInfo.id)).toISOString()
                        ).fromNow()}
                      </p>
                    )}
                  </div>
                </div>
                {/* Deletiong and download buttons  */}
                <div className="flex justify-around mt-6 text-green-600">
                  {userInfo?.uid === localUser.uid && (
                    <Popover closeOnEsc>
                      <PopoverTrigger>
                        <Button colorScheme={"red"}>
                          <IoTrash fontSize={20} color="#fff" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Confirmation!</PopoverHeader>
                        <PopoverBody>
                          Are you sure you want to delete it?
                        </PopoverBody>

                        <PopoverFooter d="flex" justifyContent="flex-end">
                          <ButtonGroup size="sm">
                            <Button
                              colorScheme="red"
                              onClick={() => deleteTheVideo(params.videoID)} // Corrected property name
                            >
                              Yes
                            </Button>
                          </ButtonGroup>
                        </PopoverFooter>
                      </PopoverContent>
                    </Popover>
                  )}
                  <a
                    href={videoInfo.videoUrl}
                    download
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="rounded-full my-2 mt-0 bg-green-400 text-white font-semibold px-5 py-2 hover:bg-green-500">
                      Free Download
                    </button>
                  </a>
                </div>
              </div>
            )}
            {/* Recommended Videos  */}
            {feeds && (
              <div className="flex flex-col w-full my-6">
                <p className="my-4 text-xl font-semibold">Recommended Videos</p>
                <RecommendedVideos feeds={feeds} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPinDetail;

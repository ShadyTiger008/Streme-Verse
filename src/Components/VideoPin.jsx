import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getUserInfo } from "../utils/fetchData";
import { firebaseApp } from "../firebase-config";
import { getFirestore } from "firebase/firestore";
import moment from "moment/moment";

const avatar =
  "https://ak.picdn.net/contributors/3038285/avatars/thumb.jpg?t=5636611";

const VideoPin = ({ data }) => {
  const videoRef = useRef(null);
  const [ userId, setUserId ] = useState(null);
  const [ userInfo, setUserInfo ] = useState(null);
  const firestoreDb = getFirestore(firebaseApp);  

  useEffect(() => {
    if(data) setUserId(data.userId);
    if(userId) {
      getUserInfo(firestoreDb, userId).then((data) => {
        // console.log(data);
        setUserInfo(data);
      }).catch((error) => {
        console.log(error);
      })
    }
    // eslint-disable-next-line
  },[userId])

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset video to start
    }
  };

  return (
    <div className="flex flex-col justify-between items-center cursor-pointer shadow-lg hover:shadow-xl rounded-md overflow-hidden relative">
      <Link to={`/videoDetail/${data?.id}`}>
        <video
          ref={videoRef}
          src={data.videoUrl}
          muted
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      </Link>
      <div className="flex flex-col absolute bottom-0 left-0 p-2 w-full bg-black/60">
        <div className="flex w-full justify-between items-center">
          <p className="isTruncated text-lg text-white">{data.title}</p>
          <Link to={`/userDetail/${userId}`}>
            <img
              src={userInfo?.photoURL ? userInfo?.photoURL : avatar} alt="user info"
              className="w-10 h-10 rounded-full mt-[-30px] border-2"
            />
          </Link>
        </div>
        <p className={`flex ml-auto text-xs text-white`}>
          {moment(new Date(parseInt(data.id)).toISOString()).fromNow()}
        </p>
      </div>
    </div>
  );
};

export default VideoPin;

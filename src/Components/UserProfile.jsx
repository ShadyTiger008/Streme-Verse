import { getFirestore } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import { firebaseApp } from "../firebase-config";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getUserInfo, userUploadedVideos } from "../utils/fetchData";
import VideoPin from "./VideoPin";

const randomImage =
  "https://source.unsplash.com/1600x900/?nature,photography,technology";

const fireStoreDb = getFirestore(firebaseApp);

const UserProfile = () => {
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [feeds, setFeeds] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    if (userId) {
      getUserInfo(fireStoreDb, userId).then((user) => {
        setUserInfo(user);
      });

      userUploadedVideos(fireStoreDb, userId)
        .then((feed) => {
          setFeeds(feed);
        })
        .catch((error) => {
          console.log("Error", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [userId]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-auto p-2">
      <div className="flex flex-col justify-center w-full relative items-center">
        <img
          src={randomImage}
          className="h-[320px] w-full object-cover rounded-md"
          alt="User Background"
        />
        <img
          src={userInfo?.photoURL}
          className="w-[120px] object-cover border-2 border-gray-100 rounded-full shadow-lg -mt-16"
          alt="User Profile"
        />
      </div>
      {isLoading ? (
        <div className="w-full h-full justify-center items-center flex">
          <BallTriangle
            height={150}
            width={150}
            radius={5}
            color="#00ffff"
            ariaLabel="ball-triangle-loading"
            wrapperClass={{}}
            wrapperStyle=""
            visible={true}
          />
        </div>
      ) : (
        feeds && (
          <div className="flex justify-center items-center h-full w-full mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {feeds && feeds.length > 0 ? (
                feeds.map((data) => {
                  const { id } = data;
                  return (
                    <div key={id} className="w-[80%] mx-auto">
                      <VideoPin data={data} />
                    </div>
                  );
                })
              ) : (
                <div className="text-center font-semibold text-red-500">
                  No recommended videos found for this category
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default UserProfile;

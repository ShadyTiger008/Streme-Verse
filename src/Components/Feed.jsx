import React, { useState, useEffect } from "react";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "../firebase-config";
import { getAllFeeds } from "../utils/fetchData";
import VideoPin from "./VideoPin";
import { MutatingDots } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import { categoryFeeds } from "../utils/fetchData";
import NotFound from "./NotFound";

const Feed = ({ data }) => {
  const [feeds, setFeeds] = useState(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  console.log(params);
  // firestore database instance
  const firestoreDb = getFirestore(firebaseApp);

  useEffect(() => {
    setLoading(true);
    console.log(params.categoryID);
    if (params.categoryID) {
      categoryFeeds(firestoreDb, params.categoryID).then((data) => {
        setFeeds(data);
        setLoading(false);
      });
    } else {
      getAllFeeds(firestoreDb).then((data) => {
        setFeeds(data);
        setLoading(false);
      });
    }
    // eslint-disable-next-line
  }, [params.categoryID]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <MutatingDots
          height="150"
          width="150"
          color="#cc2b5e"
          secondaryColor="#753a88"
          radius="12"
          ariaLabel="mutating-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          msg={"Loading your feeds"}
        />
      </div>
    );
  }

  if (!feeds?.length > 0) {
    return <NotFound />;
  }

  return (
    <div className="flex justify-center items-center h-full mx-auto p-2 sm:p-5 z-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {feeds &&
          feeds.map((data) => {
            const { id } = data;
            return (
              <div key={id} className="max-w-[420px]">
                <VideoPin data={data} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Feed;

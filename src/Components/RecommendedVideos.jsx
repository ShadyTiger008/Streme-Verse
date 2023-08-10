import React from "react";
import VideoPin from "./VideoPin";

const RecommendedVideos = ({ feeds }) => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="grid grid-cols-1 w-full gap-4">
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
  );
};

export default RecommendedVideos;

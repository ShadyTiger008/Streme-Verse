import React, { useEffect } from "react";
import { Circles } from "react-loader-spinner";

const Spinner = ({ msg, progress }) => {
  useEffect(() => {}, [progress]);

  return (
    <div className="flex flex-col justify-center items-center h-full px-10">
      <Circles color="#00BFFF" height={80} width={80} />
      <p className="font-25px text-center px-2">{msg}</p>
      {progress && (
        <div className="w-[500px] bg-gray-200 rounded-full dark:bg-gray-700 mt-10">
          <div
            className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
            style={{ width: `${progress}%` }} // Add "%" to progress value
          >
            {progress}%
          </div>
        </div>
      )}
    </div>
  );
};

export default Spinner;

import React from "react";
import notFoundSvg from "../img/notfound.svg";

const NotFound = () => {
  return (
    <div className="flex flex-col w-full justify-center items-center">
      <img src={notFoundSvg} className="w-[600px]" alt="404 error"/>
      <p className="text-[40px] font-semibold">Not Found</p>
    </div>
  );
};

export default NotFound;

import React, { useState } from "react";
import { Link } from "react-router-dom";

const Category = ({ data }) => {
  const { iconSrc } = data;
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const toggleTooltip = () => {
    setIsTooltipVisible(!isTooltipVisible);
  };

  return (
    <div
      className="flex cursor-pointer my-5 relative"
      onMouseEnter={toggleTooltip}
      onMouseLeave={toggleTooltip}
    >
      <Link to={`/category/${data.name}`}>
        <div className="relative">
          {iconSrc}
          {isTooltipVisible && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded opacity-0">
              {data.name}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Category;

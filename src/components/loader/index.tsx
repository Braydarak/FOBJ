import React from "react";
import FobjIcon from "../../icons/fobjIcon";
import { LoaderProps } from "./types";

const Loader: React.FC<LoaderProps> = ({ 
    width = "w-[40px]",
    height = "h-[40px]",
    logoSize = '30' 
  }) => {
  return (
    <div className="flex-col gap-4 w-full flex items-center justify-center">
      <div
        className={`${width} ${height} border-2 text-inputs animate-spin border-inputs flex items-center justify-center border-t-secondary rounded-full`}
      >
        <FobjIcon
          className="animate-pulse"
          size={logoSize}
          color={"#FFFF"}
        />
      </div>
    </div>
  );
};

export default Loader;

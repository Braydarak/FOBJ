import React from "react";
import { HomeIconProps } from "./types";

const HomeIcon: React.FC<HomeIconProps> = ({ color, className, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <svg
      className={className}
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <path
        d="M8.72997 23.4667V19.6445C8.72997 18.6688 9.56865 17.8779 10.6032 17.8779H14.385C14.8818 17.8779 15.3583 18.064 15.7096 18.3953C16.0609 18.7266 16.2582 19.176 16.2582 19.6445V23.4667C16.2551 23.8723 16.4238 24.2623 16.7268 24.5502C17.0298 24.8381 17.4422 25 17.8723 25H20.4524C21.6574 25.0029 22.8141 24.5535 23.6673 23.751C24.5205 22.9485 25 21.8587 25 20.7223V9.83357C25 8.91557 24.5685 8.0448 23.8219 7.45583L15.0448 0.844836C13.518 -0.314298 11.3304 -0.276872 9.8492 0.933723L1.27238 7.45583C0.490448 8.02744 0.0230951 8.90079 0 9.83357V20.7112C0 23.0798 2.03603 25 4.5476 25H7.0688C7.96214 25 8.68815 24.3203 8.69463 23.4778L8.72997 23.4667Z"
        fill={color}
      />
    </svg>
  );
};

export default HomeIcon;

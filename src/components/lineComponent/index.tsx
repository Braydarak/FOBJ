import React from "react";

interface LineComponentProps {
  color?: string;
  border?: string;
}

const LineComponent: React.FC<LineComponentProps> = ({
  color = "bg-inputBorder",
  border = "border-inputBorder"
}) => {
  return (
    <div
      className={`${color} border ${border} w-[100%] h-[1px]`}
    ></div>
  );
};

export default LineComponent;

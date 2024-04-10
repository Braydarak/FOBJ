import React from "react";

interface LineComponentProps {
  lineWidth?: string;
}

const LineComponent: React.FC<LineComponentProps> = ({ lineWidth = "1px" }) => {
  return (
    <div
      className={`bg-inputBorder border border-inputBorder w-[100%] h-[1px]`}
    ></div>
  );
};

export default LineComponent;

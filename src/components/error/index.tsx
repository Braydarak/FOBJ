import React from "react";
import { ErrorProps } from "./types";

const ErrorComponent: React.FC<ErrorProps> = ({ 
  message,
  textColor="text-errorRed", 
}) => {
  return (
    <div
      role="alert"
    >
      <span className={`block sm:inline font-bold ${textColor}`}>{message}</span>
    </div>
  );
};

export default ErrorComponent;

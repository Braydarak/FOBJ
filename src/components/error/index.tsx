import React from "react";
import { ErrorProps } from "./types";

const ErrorComponent: React.FC<ErrorProps> = ({ message }) => {
  return (
    <div
      role="alert"
    >
      <span className="block sm:inline font-bold text-errorRed">{message}</span>
    </div>
  );
};

export default ErrorComponent;

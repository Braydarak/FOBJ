import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="m-auto flex w-full h-screen pr-5 pl-5 md:pr-14 md:pl-14 md:pt-5 md:pb-5 flex-col items-center overflow-auto">
      {children}
    </div>
  );
};

export default Layout;

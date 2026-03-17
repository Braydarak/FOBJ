import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="w-full m-auto flex flex-col flex-grow items-center px-5 md:px-14 py-5 max-w-7xl">
      {children}
    </div>
  );
};

export default Layout;

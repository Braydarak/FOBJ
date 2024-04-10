import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="container m-auto flex w-full h-screen p-5  flex-col items-center">
      {children}
    </div>
  );
};

export default Layout;

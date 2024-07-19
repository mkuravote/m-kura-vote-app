import { FC, ReactNode } from "react";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col items-center h-screen overflow-hidden bg-[#f8f8f8]">
      <Header />
      <div className="flex flex-col w-full h-full overflow-scroll max-w-xl py-2 px-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;

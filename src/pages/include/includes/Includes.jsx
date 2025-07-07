import { Outlet } from "react-router-dom";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import Navbar from "../navbar/Navbar";

const Includes = () => {
  return (
    <>
      <Header />
      <Navbar />
      <Footer />
      <div className="absolute top-12 left-48 w-[calc(100%-192px)] h-[calc(100%-176px)] overflow-y-auto flex justify-center bg-saintralightblue font-PretendardM">
        <div className="w-7xl min-h-[calc(100%-32px)] p-8 my-4 bg-white rounded-xl shadow-md h-fit">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Includes;

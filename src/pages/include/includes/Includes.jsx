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
      <Outlet />
    </>
  );
};

export default Includes;

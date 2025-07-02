import { Outlet  } from "react-router-dom";
import Saintra_Logo from "/src/assets/Saintra.png";

const Authenticator = () => {

  return (
    <>
      <div className="w-full min-h-screen h-full bg-saintralightblue font-PyeojinGothicB flex justify-center items-center">
        <div className="w-3xl my-16 p-8 h-4/6  bg-white rounded-xl shadow-md flex flex-col justify-center items-center">
          <section className="text-6xl mt-12">
            <img src={Saintra_Logo} alt="Saintra" className="h-full" />
          </section>
            <Outlet />
        </div>
      </div>
    </>
  );
};

export default Authenticator;

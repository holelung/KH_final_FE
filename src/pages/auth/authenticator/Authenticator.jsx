
import { Outlet  } from "react-router-dom";


const Authenticator = () => {

  return (
    <>
      <div className="w-full min-h-screen h-full bg-saintralightblue font-PyeojinGothicB flex justify-center">
        <div className="w-3xl my-16 p-8 bg-white rounded-xl shadow-md flex flex-col justify-center items-center">
          <section className="text-6xl mt-12">Saintra Logo</section>
            <Outlet />
        </div>
      </div>
    </>
  );
};

export default Authenticator;

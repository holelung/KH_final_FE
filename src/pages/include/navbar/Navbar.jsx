import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import Saintra_Logo from "/src/assets/Saintra.png";

const Navbar = () => {
  const navi = useNavigate();
  const {logout} = useContext(AuthContext);

  return (

    <>
      <div className="absolute top-0 left-0 w-48 h-full z-10 bg-saintrablue font-PretendardM text-white flex flex-col justify-start box-border">
        <section className="w-full h-32 p-4 flex justify-center items-center">
          <div onClick={() => navi("/")} className="cursor-pointer">
            <img src={Saintra_Logo} alt="Saintra" className="h-full" />
          </div>
        </section>
        <section className="w-full h-full p-4 font-PyeojinGothicM text-xl flex flex-col justify-start gap-6">
          <div onClick={() => navi("/test")} className="w-full h-8 flex justify-start items-center gap-2 cursor-pointer">
            <div className="size-8 flex justify-center items-center">1</div>
            <div className="flex justify-center items-center">TEST</div>
          </div>
          <div onClick={() => navi("/boards?type=bulletin&page=1")} className="w-full h-8 flex justify-start items-center gap-2 cursor-pointer">
            <div className="size-8 flex justify-center items-center">2</div>
            <div className="flex justify-center items-center">공지사항</div>
          </div>
          <div onClick={() => navi("/boards?type=free&page=1")} className="w-full h-8 flex justify-start items-center gap-2 cursor-pointer">
            <div className="size-8 flex justify-center items-center">3</div>
            <div className="flex justify-center items-center">자유게시판</div>
          </div>
        </section>
        <section className="w-full h-32 p-4 font-PyeojinGothicB text-lg flex flex-col justify-center">
          <div className="w-full h-8 flex justify-start items-center gap-2">
            <div className="size-8 flex justify-center items-center">1</div>
            <div className="flex justify-center items-center" onClick={() => logout()}>로그아웃</div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Navbar;

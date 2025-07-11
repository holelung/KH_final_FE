import { Outlet } from "react-router-dom";
import Saintra_Logo from "/src/assets/Saintra_Logo.png";

const Authenticator = () => {
  return (
    // 플렉스 컨테이너
    <div className="flex justify-center items-center min-h-screen bg-slate-100 ">
      {/* 요소 출력 구역 */}
      <div className="w-3xl p-8 my-12 border-2 border-slate-300 bg-white rounded-xl font-PyeojinGothicB">
        <Outlet />
      </div>
    </div>
  );
};

export default Authenticator;

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { AuthContext } from "../../../Context/AuthContext";
import { apiService } from "../../../api/apiService";

const Header = () => {
  const { auth, logout } = useContext(AuthContext);

  const [profileImgSrc, setProfileImgSrc] = useState("");
  const [profileImgAlt, setProfileImgAlt] = useState("");

  const navi = useNavigate();

  // 프로필 이미지 가져오기
  useEffect(() => {
    apiService
      .get(`/files/users`)
      .then((res) => {
        setProfileImgSrc(res.data.data.url);
        setProfileImgAlt(res.data.data.origin);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    // 그리드 컨테이너
    <header className="grid grid-cols-[1fr_80rem_1fr] border-b-2 border-slate-300 bg-white select-none">
      {/* 그리드 아이템 1: 빈 공간 */}
      <section></section>
      {/* 그리드 아이템 2: 헤더 콘텐츠 구역 */}
      <section className="flex justify-end gap-4 p-1 font-PretendardB text-lg text-slate-600 tracking-wider">
        <button
          type="button"
          onClick={() => navi("/mypage")}
          className="relative group flex items-center gap-2 pl-3 pr-1 hover:bg-slate-600 rounded-r-md hover:text-white cursor-pointer"
        >
          <div className="absolute top-0 -left-1/3 flex justify-center size-[38px] group-hover:bg-slate-600 rounded-full">
            <div className="flex justify-center size-full border-b-1 border-slate-300 shadow-md inset-shadow-sm inset-shadow-slate-300 bg-white rounded-full">
              {profileImgSrc && <img src={profileImgSrc} alt={profileImgAlt} className="h-full rounded-full" />}
            </div>
          </div>
          <div className="pl-2">{auth.loginInfo.realname}</div>
        </button>
        <button type="button" onClick={() => logout()} className="flex items-center gap-1 pr-1 hover:bg-slate-600 rounded-md hover:text-white cursor-pointer">
          <ArrowRightStartOnRectangleIcon className="size-8" />
          <div>로그아웃</div>
        </button>
      </section>
      {/* 그리드 아이템 3: 빈 공간 */}
      <section></section>
    </header>
  );
};

export default Header;

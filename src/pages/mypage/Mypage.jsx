import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EnvelopeIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { UserIcon, LockClosedIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import { apiService } from "../../api/apiService";
import { toast } from "react-toastify";
import { AuthContext } from "../../Context/AuthContext";
import parse from "html-react-parser";

const Mypage = () => {
  const { stompClient, connectedUsers } = useContext(AuthContext);
  const navi = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [profile, setProfile] = useState({});
  const [profileUrlImgTag, setProfileImgTag] = useState("");
  const myStatus = connectedUsers.find((u) => userInfo.username === u.username)?.status;

  useEffect(() => {
    apiService.get("/users/me").then((response) => {
      if (response.data.code === "S200") {
        setUserInfo(response.data.data);
        console.log(response.data.data);
      }
    });
  }, []);

  useEffect(() => {
    apiService
      .get(`/files/users`)
      .then((res) => {
        console.log(res);
        setProfile(res.data.data);
        setProfileImgTag(`<img src="${res.data.data.url}" alt="${res.data.data.origin}" className="size-24 rounded-full" />`);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const checkIn = () => {
    apiService
      .post("/users/attendance")
      .then((response) => {
        console.log(response);
        if (response.data.code === "S201") {
          toast.success(response.data.message);
        }
      })
      .catch((error) => {
        if (error.response.data.code === "E106") {
          toast.error(error.response.data.message);
        }
      });
  };

  const checkOut = () => {
    apiService.delete("/users/attendance").then((response) => {
      if (response.data.code === "S201") {
        toast.success(response.data.message);
      }
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-evenly  md:flex-row gap-8">
        {/* 좌측 프로필 정보 */}
        <section className="flex justify-around items-center">
          <div className="flex flex-col items-center justify-center h-full">
            {/* 아바타 + 상태 */}
            <div className="relative mb-6">
              {!profileUrlImgTag ? <UserCircleIcon className="h-24 w-24 text-gray-400" /> : <>{parse(profileUrlImgTag)}</>}

              <span className="absolute bottom-0 right-0 bg-green-500 text-white text-xs rounded-full px-2 py-1">{myStatus}</span>
            </div>

            {/* 정보 리스트 */}
            <dl className="mb-6 space-y-2">
              {[
                ["사번", userInfo.username],
                ["이름", userInfo.realname],
                ["연락처", userInfo.phone],
                ["부서", userInfo.dept],
                ["팀", userInfo.team],
                ["이메일", userInfo.email],
                ["주소", userInfo.address1],
              ].map(([label, value]) => (
                <div key={label} className="flex">
                  <dt className="w-24 font-medium">{label}</dt>
                  <dd>{value != null ? value : "없음"}</dd>
                </div>
              ))}
            </dl>

            {/* 출퇴근 버튼 */}
            <div className="flex gap-4">
              <button className="bg-green-300 hover:bg-green-400 text-white font-medium py-2 px-6 rounded" onClick={() => checkIn()}>
                출근하기
              </button>
              <button className="bg-green-300 hover:bg-green-400 text-white font-medium py-2 px-6 rounded" onClick={() => checkOut()}>
                퇴근하기
              </button>
            </div>
          </div>
        </section>

        {/* 우측 액션 카드들 */}
        <section className="grid grid-cols-2 grid-rows-2 gap-6">
          {[
            { icon: <UserIcon className="h-12 w-12 text-gray-600" />, label: "내 정보 수정", navigate: "modifyProfile" },
            { icon: <LockClosedIcon className="h-12 w-12 text-gray-600" />, label: "비밀번호 변경", navigate: "updatePassword" },
            { icon: <EnvelopeIcon className="h-12 w-12 text-gray-600" />, label: "이메일 변경", navigate: "updateEmail" },
            { icon: <UserMinusIcon className="h-12 w-12 text-gray-600" />, label: "근태 조회", navigate: "attendance" },
          ].map(({ icon, label, navigate }) => (
            <div
              key={label}
              className="w-44 h-44 border border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:shadow cursor-pointer"
              onClick={() => navi(`/mypage/${navigate}`)}
            >
              {icon}
              <span className="mt-4 text-lg">{label}</span>
            </div>
          ))}
        </section>
      </div>
    </>
  );
};

export default Mypage;

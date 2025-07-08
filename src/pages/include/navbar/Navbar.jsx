import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import Saintra_Logo from "/src/assets/Saintra.png";
import {
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  MegaphoneIcon,
  PresentationChartBarIcon,
  UserCircleIcon,
  UserPlusIcon,
  UsersIcon,
  DocumentMagnifyingGlassIcon
} from "@heroicons/react/24/solid";

const Navbar = () => {
  const navi = useNavigate();
  const { auth, connectedUsers, stompClient, userStatus } = useContext(AuthContext);
  // const [userStatus, setUserStatus] = useState("OFFLINE");
  // useEffect(()=>{
  //   const myUsername = auth.loginInfo?.username;
  //   const me = connectedUsers.find(u => u.username == myUsername);
  //   if (me) setUserStatus(me.status); // 예: "ONLINE", "AWAY" 등
  // },[auth, connectedUsers])

  const changeStatus = () => {
    const client = stompClient.current;
    if (client && client.connected) {
      if (userStatus.current === "ONLINE") {
        userStatus.current = "AWAY";
      } else {
        userStatus.current = "ONLINE";
      }
      client.publish({
        destination: "/app/status.update", // app prefix 확인
        body: JSON.stringify({
          username: auth.loginInfo.username,
          status: userStatus.current,
        }),
      });
      // publish 이후 잠시 있다가 subscribe 콜백에서 새 리스트가 날아옵니다
    }
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-48 h-full z-10 bg-saintrablue font-PretendardM text-white flex flex-col justify-start box-border">
        <section className="w-full h-32 p-4 flex justify-center items-center">
          <div onClick={() => navi("/")} className="cursor-pointer">
            <img src={Saintra_Logo} alt="Saintra" className="h-full" />
          </div>
        </section>
        <section className="w-full h-full p-4 font-PyeojinGothicM text-xl flex flex-col justify-start gap-6">
        {auth.loginInfo.deptId === 1 &&(
            <>
              <div onClick={() => navi("/approve-join")} className="w-full h-8 flex justify-start items-center gap-2 cursor-pointer">
                <UserPlusIcon className="size-8 flex justify-center items-center" />
                <div className="flex justify-center items-center">가입승인</div>
              </div>
              <div onClick={() => navi("/user-manage")} className="w-full h-8 flex justify-start items-center gap-2 cursor-pointer">
                <UsersIcon className="size-8 flex justify-center items-center" />
                <div className="flex justify-center items-center">유저관리</div>
              </div>
            </>
          )}
          {auth.loginInfo.deptId === 2 && (
            <>
              <div onClick={() => navi("/log")} className="w-full h-8 flex justify-start items-center gap-2 cursor-pointer">
                <DocumentMagnifyingGlassIcon className="size-8 flex justify-center items-center"></DocumentMagnifyingGlassIcon>
                <div className="flex justify-center items-center">로그조회</div>
              </div>
            </>
          )}
          <div onClick={() => navi("/boards?type=bulletin&page=1")} className="w-full h-8 flex justify-start items-center gap-2 cursor-pointer">
            <MegaphoneIcon className="size-8 flex justify-center items-center"></MegaphoneIcon>
            <div className="flex justify-center items-center">공지사항</div>
          </div>
          <div onClick={() => navi("/boards?type=free&page=1")} className="w-full h-8 flex justify-start items-center gap-2 cursor-pointer">
            <ChatBubbleLeftRightIcon className="size-8 flex justify-center items-center"></ChatBubbleLeftRightIcon>
            <div className="flex justify-center items-center">자유게시판</div>
          </div>
          <div onClick={() => navi("/boards?type=anonymous&page=1")} className="w-full h-8 flex justify-start items-center gap-2 cursor-pointer">
            <UserCircleIcon className="size-8 flex justify-center items-center"></UserCircleIcon>
            <div className="flex justify-center items-center">익명게시판</div>
          </div>
          <div onClick={() => navi("/calendar")} className="w-full h-8 flex justify-start items-center gap-2 cursor-pointer">
            <CalendarDaysIcon className="size-8 flex justify-center items-center"></CalendarDaysIcon>
            <div className="flex justify-center items-center">캘린더</div>
          </div>
          <div onClick={() => navi("/meetingroom")} className="w-full h-8 flex justify-start items-center gap-2 cursor-pointer">
            <PresentationChartBarIcon className="size-8 flex justify-center items-center"></PresentationChartBarIcon>
            <div className="flex justify-center items-center">회의실</div>
          </div>
          <div onClick={() => navi("/chat")} className="w-full h-8 flex justify-start items-center gap-2 cursor-pointer">
            <ChatBubbleOvalLeftEllipsisIcon className="size-8 flex justify-center items-center"></ChatBubbleOvalLeftEllipsisIcon>
            <div className="flex justify-center items-center">채팅</div>
          </div>
          <div onClick={() => navi("/department")} className="w-full h-8 flex justify-start items-center gap-2 cursor-pointer">
            <BuildingOffice2Icon className="size-8 flex justify-center items-center"></BuildingOffice2Icon>
            <div className="flex justify-center items-center">부서</div>
          </div>
        </section>
        <section className="w-full h-32 p-4 font-PyeojinGothicB text-lg flex flex-col justify-center">
          <div className="w-full h-8 flex justify-start items-center gap-2">
            <div className="size-8 flex justify-center items-center">
              <span
                className={`inline-block w-5 h-5 rounded-full border-2 ${userStatus.current === "ONLINE" ? "bg-green-500" : userStatus.current === "AWAY" ? "bg-yellow-400" : "bg-gray-400"}`}
              ></span>
            </div>
            <div className="flex text-2xl justify-center items-center cursor-pointer select-none" onClick={() => changeStatus()}>
              {auth.loginInfo.realname}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Navbar;

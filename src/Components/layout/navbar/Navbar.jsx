import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";
import Saintra_Logo from "/src/assets/Saintra_Logo.png";
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
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

// 버튼 생성자
class NavButton {
  constructor(key, text, path, icon) {
    this.key = key;
    this.text = text;
    this.path = path;
    this.icon = icon;
  }
}

const Navbar = () => {
  // 아이콘 스타일
  const IconStyle = "size-8 flex justify-center items-center";

  // 버튼 배열
  const NavElementList = [
    new NavButton(0, "가입승인", "/approve-join", <UserPlusIcon className={IconStyle} />),
    new NavButton(1, "유저관리", "/user-manage", <UsersIcon className={IconStyle} />),
    new NavButton(2, "로그조회", "/log", <DocumentMagnifyingGlassIcon className={IconStyle} />),
    new NavButton(3, "공지사항", "/boards?type=bulletin&page=1", <MegaphoneIcon className={IconStyle} />),
    new NavButton(4, "자유게시판", "/boards?type=free&page=1", <ChatBubbleLeftRightIcon className={IconStyle} />),
    new NavButton(5, "익명게시판", "/boards?type=anonymous&page=1", <UserCircleIcon className={IconStyle} />),
    new NavButton(6, "캘린더", "/calendar", <CalendarDaysIcon className={IconStyle} />),
    new NavButton(7, "회의실", "/meetingroom", <PresentationChartBarIcon className={IconStyle} />),
    new NavButton(8, "채팅", "/chat", <ChatBubbleOvalLeftEllipsisIcon className={IconStyle} />),
    new NavButton(9, "부서", "/department", <BuildingOffice2Icon className={IconStyle} />),
  ];

  const { auth, stompClient, userStatus } = useContext(AuthContext);

  const navi = useNavigate();

  // 상태 표시 처리
  const changeStatus = () => {
    const client = stompClient.current;
    if (client?.connected) {
      if (userStatus.current === "ONLINE") {
        userStatus.current = "AWAY";
      } else {
        userStatus.current = "ONLINE";
      }
      client.publish({
        destination: "/app/status.update",
        body: JSON.stringify({
          username: auth.loginInfo.username,
          status: userStatus.current,
        }),
      });
    }
  };

  return (
    // 그리드 컨테이너
    <aside className="row-span-2 grid grid-rows-[6rem_1fr_6rem] bg-saintrablue font-PyeojinGothicB text-slate-800 select-none">
      {/* 그리드 아이템 1: 홈 아이콘 구역 */}
      <section>
        <button type="button" onClick={() => navi("/")} className="flex items-center h-full py-4 text-4xl text-slate-900 cursor-pointer">
          <img id="icon" src={Saintra_Logo} alt="Saintra" className="h-full p-1" />
          <div>Saintra</div>
        </button>
      </section>
      {/* 그리드 아이템 2: 버튼 구역 */}
      <section className="flex flex-col gap-6 p-4">
        {NavElementList.map((nav) => {
          // 권한에 따라 추가되는 버튼
          if (nav.key === 0 && auth.loginInfo.deptId !== 1) {
            return;
          }
          if (nav.key === 1 && auth.loginInfo.deptId !== 1) {
            return;
          }
          if (nav.key === 2 && auth.loginInfo.deptId !== 2) {
            return;
          }
          return (
            <button key={nav.key} type="button" onClick={() => navi(nav.path)} className="flex items-center gap-4 h-fit text-xl tracking-wider cursor-pointer">
              {nav.icon}
              {nav.text}
            </button>
          );
        })}
      </section>
      {/* 그리드 아이템 3: 상태 표시 구역 */}
      <section className="flex items-center gap-2 px-4">
        <div className={`w-6 h-6 border-2 border-white rounded-full ${userStatus.current === "AWAY" ? "bg-yellow-400" : "bg-green-500"}`} />
        <button
          type="button"
          onClick={() => {
            changeStatus();
          }}
          className="text-2xl cursor-pointer"
        >
          {userStatus.current === "AWAY" ? "자리비움" : "접속 중"}
        </button>
      </section>
    </aside>
  );
};

export default Navbar;

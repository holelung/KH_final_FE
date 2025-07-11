import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";
import PropTypes from "prop-types";
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
  Cog6ToothIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
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

const Navbar = (props) => {
  // 네비게이션 버튼 아이콘 스타일
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
    new NavButton(10, "설정", "/setting", <Cog6ToothIcon className={IconStyle} />),
  ];

  const { auth, stompClient, userStatus } = useContext(AuthContext);

  const [isVisible, setIsVisible] = useState(false);

  const navi = useNavigate();

  // 네비게이션 바 변환 버튼 초기화
  useEffect(() => {
    setIsVisible(false);
  }, [props.isCollapsed]);

  // 상태 표시 처리
  const handleUserStatus = (props) => {
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

  // 네비게이션 바 변환 버튼 표시 여부 처리
  const handleHiddenButton = () => {
    setIsVisible(!isVisible);
  };

  return (
    // 그리드 컨테이너
    <aside className="relative row-span-2 grid grid-rows-[6rem_1fr_6rem] z-20 bg-white font-PyeojinGothicB text-slate-600 select-none">
      {/* 그리드 아이템 1: 홈 아이콘 구역 */}
      <section className="flex justify-center items-center border-b-2 border-r-2 border-slate-300">
        <button
          type="button"
          onClick={() => navi("/")}
          className={`flex justify-center items-center gap-1 w-full h-full ${props.isCollapsed ? "" : "p-1"} text-4xl text-slate-600 cursor-pointer`}
        >
          <img id="icon" src={Saintra_Logo} alt="Saintra" className="h-12" />
          {props.isCollapsed ? <></> : <div>Saintra</div>}
        </button>
      </section>
      {/* 그리드 아이템 2: 버튼 구역 */}
      <section
        className={`flex flex-col gap-6 overflow-x-hidden overflow-y-auto scrollbar-hide ${props.isCollapsed ? "items-center py-6" : "px-4 py-6"} border-r-2 border-slate-300`}
      >
        {/* 네비게이션 버튼 */}
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
            <button
              key={nav.key}
              type="button"
              onClick={() => navi(nav.path)}
              className={`flex items-center gap-4 ${props.isCollapsed ? "size-fit" : "h-fit"} p-1 hover:bg-slate-600 border-b-2 border-slate-400 hover:border-slate-600 rounded-lg inset-shadow-sm inset-shadow-slate-400 text-xl tracking-wider hover:text-white cursor-pointer`}
            >
              {nav.icon}
              {props.isCollapsed ? <></> : <>{nav.text}</>}
            </button>
          );
        })}
      </section>
      {/* 그리드 아이템 3: 상태 표시 구역 */}
      <section className={`flex ${props.isCollapsed ? "justify-center" : ""} items-center border-t-2 border-r-2 border-slate-300`}>
        <button
          type="button"
          onClick={() => {
            handleUserStatus();
          }}
          className={`group flex ${props.isCollapsed ? "justify-center" : ""} items-center gap-4 text-2xl cursor-pointer`}
        >
          <div
            className={`${props.isCollapsed ? "size-8" : "size-8 ml-4"} border-b-2 border-slate-400 rounded-full inset-shadow-sm inset-shadow-slate-400 ${userStatus.current === "AWAY" ? "bg-yellow-400" : "bg-green-500"}`}
          />
          {props.isCollapsed ? (
            <></>
          ) : (
            <div className="px-2 py-1 group-hover:bg-slate-600 rounded-lg group-hover:text-white">{userStatus.current === "AWAY" ? "자리비움" : "접속 중"}</div>
          )}
        </button>
      </section>
      {/* 크기 전환 버튼*/}
      <section
        onMouseEnter={() => handleHiddenButton()}
        onMouseLeave={() => handleHiddenButton()}
        className="absolute top-0 bottom-0 right-0 translate-x-1/2 z-5 w-6"
      >
        <button
          type="button"
          onClick={props.handleNavbarCollapsed}
          className={`absolute top-1/2 -translate-y-1/2 w-full h-36 bg-white hover:bg-slate-600 border-b-2 border-slate-400 hover:border-slate-600 rounded-md inset-shadow-sm inset-shadow-slate-300 hover:text-white cursor-pointer ${isVisible ? "" : "hidden"}`}
        >
          {props.isCollapsed ? <ChevronDoubleRightIcon /> : <ChevronDoubleLeftIcon />}
        </button>
      </section>
    </aside>
  );
};

Navbar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  handleNavbarCollapsed: PropTypes.func.isRequired,
};

export default Navbar;

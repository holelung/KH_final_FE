import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";
import PropTypes from "prop-types";
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
    // new NavButton(10, "설정", "/setting", <Cog6ToothIcon className={IconStyle} />),
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
    <aside className="relative row-span-2 grid grid-rows-[6rem_1fr_6rem] z-20 bg-white font-EliceDigitalBaeumB text-slate-600 select-none">
      {/* 그리드 아이템 1: 홈 아이콘 구역 */}
      <section className="flex justify-center items-center border-b-2 border-r-2 border-slate-300">
        <button
          type="button"
          onClick={() => navi("/")}
          className={`flex justify-center items-center gap-1 w-full h-full ${props.isCollapsed ? "" : "p-1"} text-4xl text-slate-600 cursor-pointer`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 fill-slate-600" version="1" viewBox="0 0 1024 1024">
            <path d="M501 58.8c-3 1-13.7 6.9-23.8 13-40.9 25-68.9 40.1-99.7 53.7-56.8 25.1-122.8 43.7-201 56.4-20 3.3-23.1 4-28.2 6.7-7 3.7-13.9 11-17.6 18.4l-3.2 6.5-.3 141.5c-.4 165.9-.1 172.2 8.3 214.5 12.9 64.7 41.4 127.2 83.6 183.5 16.1 21.5 28.4 35.6 48.9 56 49.7 49.7 116.7 95.6 196.5 135 26.8 13.2 34.9 16.6 43.2 18.1 10.8 2 18.6-.5 51.1-16.6 104.4-51.5 186.9-114.8 241.3-185 51.9-66.9 82.2-138.4 92.9-219.4 3.7-27.8 4-43.3 4-183.1 0-148.6.1-144-5.6-153.7-3.5-6-9.9-12-16.5-15.3-4.5-2.3-10.4-3.7-30-7-32.1-5.4-50.5-9.1-72.4-14.5-82.5-20.3-152.4-50-224.4-95.3-19.3-12.1-24.7-14.5-34-14.9-5.4-.2-9.2.2-13.1 1.5m17.3 78.6c1.8.7 8.2 4.6 14.2 8.6 55.6 36.9 121.9 65.9 197.9 86.5 28.9 7.9 54.4 13.1 89.4 18.6l7.3 1.1-.4 131.6c-.4 143.2-.2 138-6.2 169.3-11.1 57.2-35.8 111.1-72.9 158.9-14 17.9-24.3 29.4-41.7 46.5-44.9 44-104.8 85.4-171.6 118.9-22.3 11.1-21.4 11.1-41.1 1.2-105.6-52.9-183.9-117.7-234.9-194.1-34.4-51.6-55.4-112.6-60.3-175.4-1.2-15.6-1.4-257.1-.2-257.1.4 0 7.9-1.1 16.7-2.5 73.7-11.6 139.7-31.8 205.8-63.2 26.8-12.7 44.1-22.2 69.1-38.1 20.4-12.9 22.3-13.6 28.9-10.8"></path>
            <path d="M699.3 331.9c-2.8.9-6.9 3-9 4.5-2.1 1.6-56.4 55.7-120.8 120.2L452.5 574 398 520c-61.9-61.3-60.8-60.4-74.9-60.5-10.3 0-16.7 2.4-23.6 8.7s-10 11.5-11.5 19.3c-1.5 7.5-.2 15.6 3.6 22.4 1.7 3.3 24.5 26.7 72.7 74.9 79.4 79.3 75 75.6 90.2 75.7 6.3 0 9-.5 13-2.4 4.1-1.9 30.2-27.5 140.1-137.5C739 389.2 742.8 385.3 745 379.5c8.8-24.2-9.1-49.6-34.9-49.5-3.1.1-7.9.9-10.8 1.9"></path>
          </svg>
          {props.isCollapsed ? <></> : <div className="pt-1 font-SebangGothicB">Saintra</div>}
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
              className={`flex items-center gap-4 ${props.isCollapsed ? "size-fit" : "h-fit"} p-1 hover:bg-slate-600 border-b-2 border-slate-400 hover:border-slate-600 rounded-lg inset-shadow-sm inset-shadow-slate-400 text-lg tracking-wider hover:text-white cursor-pointer`}
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
            <div className="px-2 pt-1 pb-2 group-hover:bg-slate-600 rounded-lg text-2xl group-hover:text-white">
              {userStatus.current === "AWAY" ? "자리비움" : "접속 중"}
            </div>
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

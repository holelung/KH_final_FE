import { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import Header from "../header/Header";
import DisplayArea from "../displayarea/DisplayArea";

const Grid = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // 저장된 네비게이션 바 상태 불러오기
  useEffect(() => {
    const NavbarCollapsed = localStorage.getItem("NavbarCollapsed");
    if (NavbarCollapsed) {
      if (NavbarCollapsed === "true") {
        setIsCollapsed(true);
        return;
      }
    }
    setIsCollapsed(false);
  }, []);

  // 네비게이션 바 변환 처리
  const handleNavbarCollapsed = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      localStorage.setItem("NavbarCollapsed", "false");
      return;
    }
    setIsCollapsed(true);
    localStorage.setItem("NavbarCollapsed", "true");
  };

  return (
    <div className={`grid ${isCollapsed ? "grid-cols-[4rem_1fr]" : "grid-cols-[12rem_1fr]"} grid-rows-[3rem_1fr] h-screen`}>
      {/* 네비게이션 바 */}
      <Navbar isCollapsed={isCollapsed} handleNavbarCollapsed={handleNavbarCollapsed} />
      {/* 헤더 */}
      <Header />
      {/* 본문 */}
      <DisplayArea />
    </div>
  );
};

export default Grid;

import { useState } from "react";
import Navbar from "../navbar/Navbar";
import Header from "../header/Header";
import DisplayArea from "../displayarea/DisplayArea";

const Grid = () => {
  const [isShrink, setIsShrink] = useState(false);

  // Navbar 크기 처리
  const handleNavbarIsShrink = () => {
    setIsShrink(!isShrink);
  };

  return (
    <div className={`grid ${isShrink ? "grid-cols-[4rem_1fr]" : "grid-cols-[12rem_1fr]"} grid-rows-[3rem_1fr] h-screen`}>
      {/* 네비게이션 바 */}
      <Navbar isShrink={isShrink} handleNavbarIsShrink={handleNavbarIsShrink} />
      {/* 헤더 */}
      <Header />
      {/* 본문 */}
      <DisplayArea />
    </div>
  );
};

export default Grid;

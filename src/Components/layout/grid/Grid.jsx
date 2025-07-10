import Navbar from "../navbar/Navbar";
import Header from "../header/Header";
import DisplayArea from "../displayarea/DisplayArea";

const Grid = () => {
  return (
    <div className="grid grid-cols-[12rem_1fr] grid-rows-[3rem_1fr] min-h-screen">
      {/* 네비게이션 바 */}
      <Navbar />
      {/* 헤더 */}
      <Header />
      {/* 본문 */}
      <DisplayArea />
    </div>
  );
};

export default Grid;

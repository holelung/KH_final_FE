import { Outlet } from "react-router-dom";
import Footer from "../footer/Footer";

const DisplayArea = () => {
  return (
    <main className="overflow-x-hidden overflow-y-auto scrollbar-hide bg-gray-100">
      {/* 스크롤 영역 */}
      <section className="relative flex flex-col items-center gap-8 py-8">
        {/* 컨텐츠 영역 */}
        <div className="w-7xl min-h-[calc(100vh-15rem)] p-8 mb-32 shadow-md bg-white rounded-xl">
          <Outlet />
        </div>
        {/* 푸터 */}
        <Footer />
      </section>
    </main>
  );
};

export default DisplayArea;

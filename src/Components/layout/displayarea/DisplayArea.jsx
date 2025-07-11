import { Outlet } from "react-router-dom";
import Footer from "../footer/Footer";

const DisplayArea = () => {
  return (
    <main className="overflow-x-hidden overflow-y-auto scrollbar-hide bg-slate-100">
      {/* 스크롤 영역 */}
      <section className="relative flex flex-col items-center gap-8 py-8">
        {/* 컨텐츠 영역 */}
        <div className="w-7xl min-h-[calc(100vh-13rem)] p-8 mb-[6rem] border-2 border-slate-300 bg-white rounded-xl">
          <Outlet />
        </div>
        {/* 푸터 */}
        <Footer />
      </section>
    </main>
  );
};

export default DisplayArea;

import { Outlet } from "react-router-dom";
import Footer from "../footer/Footer";

const DisplayArea = () => {
  return (
    <main className="h-full overflow-y-auto bg-saintragray">
      {/* 스크롤 영역 */}
      <section className="flex flex-col items-center gap-8 min-h-full pt-8">
        {/* 컨텐츠 영역 */}
        <div className="w-7xl min-h-[calc(100vh-15rem)] p-8 bg-white rounded-xl">
          <Outlet />
        </div>
        {/* 푸터 */}
        <Footer />
      </section>
    </main>
  );
};

export default DisplayArea;

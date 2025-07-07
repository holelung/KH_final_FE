const Footer = () => {
  return (
    <>
      <div className="fixed bottom-0 left-48 w-[calc(100%-192px)] h-32 z-50 bg-gray-800 text-white font-PretendardM flex justify-center items-center shadow-inner">
        <div className="max-w-3xl w-full px-4 flex flex-col justify-center items-center gap-2 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-base font-semibold">
            <a href="#" className="hover:underline text-blue-400">
              개인정보 처리방침
            </a>
            <span className="hidden sm:inline text-white/80">|</span>
            <a href="#" className="hover:underline text-blue-400">
              이메일 무단수집 거부
            </a>
            <span className="hidden sm:inline text-white/80">|</span>
            <a href="#" className="hover:underline text-blue-400">
              이용약관
            </a>
          </div>
          <div className="text-white text-sm mt-2 font-semibold">KH정보교육원 종로지원 | 에코로그 팀</div>
          <div className="text-white/80 text-xs">남대문로 120 그레이츠 청계 2층, 3층</div>
        </div>
      </div>
    </>
  );
};

export default Footer;

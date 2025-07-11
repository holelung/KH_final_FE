const Footer = () => {
  return (
    // 그리드 컨테이너
    <footer className="absolute bottom-0 grid grid-cols-[1fr_80rem_1fr] w-full h-[6rem] border-t-2 border-slate-300 bg-white">
      {/* 그리드 아이템 1: 빈 공간 */}
      <section></section>
      {/* 그리드 아이템 2: 푸터 콘텐츠 구역 */}
      <section className="flex flex-col justify-center items-center gap-1 font-PretendardM text-sm text-slate-300 text-shadow-slate-600">
        <div>Project Saintra | 2025-06-12 ~ 2025-07-10</div>
        <div>KH정보교육원 종로지원 | 팀 퇴근원정대</div>
        <div>남대문로 120 그레이츠 청계 2층, 3층</div>
      </section>
      {/* 그리드 아이템 3: 빈 공간 */}
      <section></section>
    </footer>
  );
};

export default Footer;

const Footer = () => {
  return (
    // 그리드 컨테이너
    <footer className="absolute bottom-0 grid grid-cols-[1fr_80rem_1fr] w-full h-32 bg-white">
      {/* 그리드 아이템 1: 빈 공간 */}
      <section></section>
      {/* 그리드 아이템 2: 푸터 콘텐츠 구역 */}
      <section className=""></section>
      {/* 그리드 아이템 3: 빈 공간 */}
      <section></section>
    </footer>
  );
};

export default Footer;

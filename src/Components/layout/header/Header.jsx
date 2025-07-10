const Header = () => {
  return (
    // 그리드 컨테이너
    <header className="grid grid-cols-[1fr_80rem_1fr] bg-white">
      {/* 그리드 아이템 1: 빈 공간 */}
      <section></section>
      {/* 그리드 아이템 2: 헤더 콘텐츠 구역 */}
      <section className=""></section>
      {/* 그리드 아이템 3: 빈 공간 */}
      <section></section>
    </header>
  );
};

export default Header;

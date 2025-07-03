const Header = () => {
  return (
    <>
      <div className="absolute top-0 w-full h-12 z-5 bg-saintralightblue shadow-md font-PretendardM flex justify-center items-center box-border">
        <div className="w-5xl h-full flex justify-end items-center gap-4">
          <div className="size-full flex justify-between">
            <div className="ml-2 flex justify-center items-center">사용자 이름 님 안녕하세요!</div>
            <div className="mr-2 flex justify-center items-center">내 정보(사진)</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

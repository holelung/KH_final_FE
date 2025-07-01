const Navbar = () => {
  return (
    <>
      <div className="absolute top-0 left-0 w-48 h-full z-10 bg-saintrablue font-PretendardM text-white flex flex-col justify-start box-border">
        <section className="w-full h-32 p-4">로고</section>
        <section className="w-full h-full p-4 font-PyeojinGothicM text-xl flex flex-col justify-start gap-6">
          <div className="w-full h-8 flex justify-start items-center gap-2">
            <div className="size-8 flex justify-center items-center">1</div>
            <div className="flex justify-center items-center">메뉴</div>
          </div>
          <div className="w-full h-8 flex justify-start items-center gap-2">
            <div className="size-8 flex justify-center items-center">2</div>
            <div className="flex justify-center items-center">메뉴</div>
          </div>
          <div className="w-full h-8 flex justify-start items-center gap-2">
            <div className="size-8 flex justify-center items-center">3</div>
            <div className="flex justify-center items-center">메뉴</div>
          </div>
          <div className="w-full h-8 flex justify-start items-center gap-2">
            <div className="size-8 flex justify-center items-center">4</div>
            <div className="flex justify-center items-center">메뉴</div>
          </div>
          <div className="w-full h-8 flex justify-start items-center gap-2">
            <div className="size-8 flex justify-center items-center">5</div>
            <div className="flex justify-center items-center">메뉴</div>
          </div>
        </section>
        <section className="w-full h-32 p-4 font-PyeojinGothicB text-lg flex flex-col justify-center">
          <div className="w-full h-8 flex justify-start items-center gap-2">
            <div className="size-8 flex justify-center items-center">1</div>
            <div className="flex justify-center items-center">로그아웃</div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Navbar;

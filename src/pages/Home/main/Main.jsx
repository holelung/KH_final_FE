const Main = () => {
  return (
    <>
      <div className="w-screen h-dvh">
        <div className="absolute top-0 w-full h-12 z-5 bg-gray-400"></div>
        <div className="absolute top-0 left-0 w-48 h-full z-10 bg-white"></div>
        <div className="absolute bottom-0 w-full h-32 z-5 bg-gray-400"></div>
        <div className="absolute top-12 left-48 w-[calc(100%-192px)] min-h-[calc(100%-48px)] bg-gray-200">
          <div className="w-[calc(100%-60px)] h-full m-8 bg-white flex justify-center items-center">요소</div>
        </div>
      </div>
    </>
  );
};

export default Main;

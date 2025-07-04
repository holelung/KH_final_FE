const DisplayArea = ({ children }) => {
  return (
    <>
      <div className="w-full h-[calc(100vh-176px)] overflow-auto flex justify-center bg-saintralightblue font-PretendardM">
        <div className="w-full max-w-6xl p-8 my-4 h-full break-words bg-white rounded-xl shadow-md">{children}</div>
      </div>
    </>
  );
};

export default DisplayArea;

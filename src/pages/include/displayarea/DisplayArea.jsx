const DisplayArea = ({ children }) => {
  return (
    <>
      <div className="absolute top-12 w-full h-[calc(100%-176px)] overflow-y-auto flex justify-center bg-saintralightblue font-PretendardM">
        <div className="w-5xl min-h-[calc(100%-176px)] p-8 my-4 bg-white rounded-xl shadow-md">{children}</div>
      </div>
    </>
  );
};

export default DisplayArea;

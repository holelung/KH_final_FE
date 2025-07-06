
const Loading = () => {

  return (
    <>
      <div className="fixed inset-0 z-99 flex items-center justify-center bg-white opacity-30">
        <svg className="animate-spin h-16 w-16 mr-2 text-gray-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="black" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="black" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    </>
  )
}

export default Loading;
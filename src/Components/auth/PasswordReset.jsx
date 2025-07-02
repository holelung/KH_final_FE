import { useNavigate } from "react-router-dom";

const PasswordReset = () => {
  const navi = useNavigate();


  return (
    <>

      {/* 제목 */}
      <section className="mt-12 text-6xl flex flex-col gap-6">
        <div className="text-6xl">Reissue Password</div>
        <div className="text-2xl text-gray-500 flex justify-center">For Forgot Password User</div>
      </section>

      {/* 비밀번호 찾기 필요 정보 입력 폼 */}
      <section className="size-full mt-12 font-PyeojinGothicB flex flex-col gap-6">
        <div className="px-24">
          <input
            id="password"
            type="password"
            placeholder="NEW PASSWORD"
            className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg"
          />
        </div>
        <div className="px-24">
          <input
            id="confirmPassword"
            type="password"
            placeholder="CONFIRM NEW PASSWORD"
            className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg"
          />
        </div> 
      </section>

      <section className="my-12 text-lg text-gray-500 cursor-pointer hover:text-gray-600 active:scale-95 select-none">
        <div onClick={() => navi("/authenticator")}>Go Back to Authenticator</div>
      </section>
    </>
  );
}

export default PasswordReset;
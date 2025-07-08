import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiService } from "../../api/apiService";
import { toast } from "react-toastify";
import Loading from "../Loading/Loading";

const ReissuePassword = () => {
  const navi = useNavigate();
  const [ username, setUsername ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);

  const reissueHandler = () => {
    setIsLoading(true);
    apiService.post('/auth/password', {username}, { auth: false })
      .then(response => {
        if(response.data.code === "S101") {
          setIsLoading(false);
          toast.success("비밀번호 변경 메일이 발송되었습니다.");
        }
      })
      .catch(error => {
        setIsLoading(false);
      });
  }

  return (
    <>
      { isLoading && (
        <Loading />
      )}
      {/* 제목 */}
      <section className="mt-12 text-6xl flex flex-col gap-6">
        <div className="text-6xl">Reissue Password</div>
        <div className="text-2xl text-gray-500 flex justify-center">For Forgot Password User</div>
      </section>

      {/* 비밀번호 찾기 필요 정보 입력 폼 */}
      <section className="size-full mt-12 font-PyeojinGothicB flex flex-col gap-6">
        <div className="px-24">
          <input
            id="username"
            type="text"
            placeholder="USERNAME"
            className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
      </section>
      <section className="mt-12">
        <button 
          className="w-48 h-20 text-3xl text-white bg-saintragreen rounded-xl cursor-pointer hover:opacity-90 active:scale-95" 
          onClick={() => reissueHandler()}>
          Reissue
        </button>
      </section>

      <section className="my-12 text-lg text-gray-500 cursor-pointer hover:text-saintradarkblue active:scale-95 select-none">
        <div onClick={() => navi("/authenticator")}>Go Back to Authenticator</div>
      </section>
    </>
  );
}

export default ReissuePassword;
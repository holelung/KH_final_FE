import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { apiService } from "../../api/apiService";
import { toast } from "react-toastify";


const PasswordReset = () => {
  const navi = useNavigate();
  const [ searchParams, setSearchParams ] = useSearchParams();
  const key = searchParams.get("key");
  const [ passwordData, setPasswordData ] = useState({
    "password": '',
    "accessKey": key,
  });
  const [ confirmPassword, setConfirmPassword ] = useState('');
  
  const resetHandler = () => {
    apiService.patch('/auth/password', passwordData, { auth: false })
      .then(response => {
        if(response.data.code === "S202") {
          toast.success("비밀번호가 성공적으로 변경되었습니다.");
          navi("/authenticator");
        }
      });

  }


  return (
    <>

      {/* 제목 */}
      <section className="mt-12 text-6xl flex flex-col gap-6">
        <div className="text-6xl">Reset Password</div>
        <div className="text-2xl text-gray-500 flex justify-center">For Forgot Password User</div>
      </section>

      {/* 비밀번호 변경 폼 */}
      <section className="size-full mt-12 font-PyeojinGothicB flex flex-col gap-6">
        <div className="px-24">
          <input
            id="password"
            type="password"
            placeholder="NEW PASSWORD"
            className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg"
            onChange={(e) => setPasswordData(prev => ({
              ...prev,
              password: e.target.value,
            }))}
            value={passwordData.password}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="px-24">
            <input
              id="confirmPassword"
              type="password"
              placeholder="CONFIRM NEW PASSWORD"
              className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </div>
          { confirmPassword !== passwordData.password && (
            <div className="text-sm text-red-500 self-center">
              Passwords do not match.
            </div>
          )}
        </div>
      </section>
      <section className="mt-12">
        <button 
          className="w-48 h-20 text-3xl text-white bg-saintragreen rounded-xl cursor-pointer hover:opacity-90 active:scale-95" 
          onClick={() => resetHandler()}
        >
          Reset
        </button>
      </section>
      <section className="my-12 text-lg text-gray-500 cursor-pointer hover:text-saintradarkblue active:scale-95 select-none">
        <div onClick={() => navi("/authenticator")}>Go Back to Authenticator</div>
      </section>
    </>
  );
}

export default PasswordReset;
import { useState } from "react";
import { apiService } from "../../api/apiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const navi = useNavigate();
  const [passwordData, setPasswordData] = useState({
    prevPassword: '',
    password:'',
  });
  const [confirmPassword, setConfirmPassword] = useState('');


  const updateHandler = () => {
    apiService.patch('/users/password', passwordData)
      .then(response => {
        if(response.data.code === "S202") {
          toast.success(response.data.message);
          navi('/mypage');
        }
      })
      .error(error => {
        toast.error(error.response.data.message || "비밀번호 변경에 실패했습니다.");
      })
  }

  return (
    <>
      {/* 비밀번호 변경 폼 */}
      <div className="flex flex-col items-center">
        <h2 className="font-PretendardB text-2xl">PASSWORD UPDATE</h2>
        <section className="size-full mt-12 font-PyeojinGothicB flex flex-col gap-6">
          <div className="px-24">
            <input
              id="prevPassword"
              type="password"
              placeholder="PREVIOUS PASSWORD"
              className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg"
              onChange={(e) => setPasswordData(prev => ({
                ...prev,
                prevPassword: e.target.value,
              }))}
              value={passwordData.prevPassword}
            />
          </div>
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
            onClick={() => updateHandler()}
          >
            Update
          </button>
        </section>
        <section className="my-12 text-lg text-gray-500 cursor-pointer hover:text-saintradarkblue active:scale-95 select-none">
          <div onClick={() => navi("/mypage")}>&lt; Go Back</div>
        </section>
      </div>
    </>
  );
}
export default UpdatePassword;
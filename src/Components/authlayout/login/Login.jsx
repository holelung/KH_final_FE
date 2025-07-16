import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";
import { apiService } from "../../../api/apiService";

const Login = () => {
  const { login } = useContext(AuthContext);

  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });

  const navi = useNavigate();

  // 로그인 제출 데이터 세팅
  const handleLoginInfo = (e) => {
    const key = e.target.id;
    const value = e.target.value;
    setLoginInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 로그인 데이터 제출
  const handleSubmitLogin = (e) => {
    e.preventDefault();
    apiService
      .post("auth/tokens", loginInfo, { auth: false })
      .then((res) => {
        login(res.data.data.loginInfo, res.data.data.tokens);
      })
      .catch((err) => {
        if (err.response.data.code === "E401") {
          toast.error(err.response.data.message);
        }
      });
  };

  return (
    <>
      {/* 플렉스 아이템 2: 컴포넌트 구역 */}
      <div className="flex flex-col items-center gap-10">
        {/* 플렉스 아이템 2-1: 로그인 텍스트 */}
        <section className="flex flex-col items-center gap-6 font-EliceDigitalBaeumB select-none">
          <div className="text-5xl text-slate-500">로그인</div>
          <div className="text-3xl text-slate-400">환영합니다!</div>
        </section>
        {/* 플렉스 아이템 2-2: 로그인 값 입력 폼 */}
        <form onSubmit={(e) => handleSubmitLogin(e)} className="flex flex-col items-center gap-4 font-SebangGothicB text-xl">
          {/* 사번 입력 */}
          <input
            id="username"
            type="text"
            onChange={(e) => handleLoginInfo(e)}
            value={loginInfo.username}
            placeholder="사번"
            className="w-128 px-4 py-3 border-2 border-slate-400 rounded-md tracking-wide"
          />
          {/* 비밀번호 입력 */}
          <input
            id="password"
            type="password"
            onChange={(e) => handleLoginInfo(e)}
            value={loginInfo.password}
            placeholder="비밀번호"
            className="w-128 px-4 py-3 border-2 border-slate-400 rounded-md tracking-wide"
          />
          {/* 제출 버튼 */}
          <button type="submit" className="w-40 py-4 mt-4 bg-green-300 hover:bg-green-400 rounded-md text-2xl text-white cursor-pointer select-none">
            로그인
          </button>
        </form>
      </div>
      {/* 플렉스 아이템 3: 네비게이션 구역 */}
      <div className="flex justify-center gap-4 font-EliceDigitalBaeumB text-lg text-slate-500 select-none">
        <button type="button" onClick={() => navi("/authenticator/registration")} className="cursor-pointer">
          사원 등록
        </button>
        <div>|</div>
        <button type="button" onClick={() => navi("/authenticator/reissue-password")} className="cursor-pointer">
          비밀번호 재발급
        </button>
      </div>
    </>
  );
};

export default Login;

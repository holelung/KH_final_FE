import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const [ragistrationInfo, setRagistrationInfo] = useState({
    username: "",
    password: "",
    realname: "",
    phone: "",
    ssnFront: "",
    ssnBack: "",
    address1: "",
    address2: "",
  });

  const [verifyCode, setVerifyCode] = useState("");

  const navi = useNavigate();

  // 전화번호 형식 변환
  const convertPhoneFormat = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    const parts = digits.match(/^(\d{0,3})(\d{0,4})(\d{0,4})$/);
    if (!parts) return digits;
    return [parts[1], parts[2], parts[3]].filter((part) => part).join("-");
  };

  // 회원가입 제출 데이터 세팅
  const handleRegistrationInfo = (e) => {
    const key = e.target.id;
    const value = e.target.value;
    // 전화번호 형식 변환
    if (key === "phone") {
      convertPhoneFormat(value);
    }
    setRagistrationInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 이메일 인증번호 세팅
  const handleVerifyCode = (e) => {
    const value = e.target.value;
    setVerifyCode(value);
  };

  return (
    <>
      {/* 플렉스 아이템 2: 컴포넌트 구역 */}
      <div className="flex flex-col items-center gap-10">
        {/* 플렉스 아이템 2-1: 회원가입 텍스트 */}
        <section className="flex flex-col items-center gap-6 font-EliceDigitalBaeumB select-none">
          <div className="text-5xl text-slate-500">사원 등록</div>
          <div className="text-3xl text-slate-400">새로운 직원 등록!</div>
        </section>
        {/* 플렉스 아이템 2-2: 회원가입 값 입력 폼 */}
        <form onSubmit={(e) => handleSubmitRegistration(e)} className="flex flex-col items-center gap-4 font-SebangGothicB text-xl">
          {/* 사번 입력 */}
          <input
            id="username"
            type="text"
            onChange={(e) => handleRegistrationInfo(e)}
            value={ragistrationInfo.username}
            placeholder="사번"
            className="w-128 px-4 py-3 border-2 border-slate-400 rounded-md tracking-wide"
          />
          {/* 비밀번호 입력 */}
          <input
            id="password"
            type="password"
            onChange={(e) => handleRegistrationInfo(e)}
            value={ragistrationInfo.password}
            placeholder="비밀번호"
            className="w-128 px-4 py-3 border-2 border-slate-400 rounded-md tracking-wide"
          />
          {/* 실명 입력 */}
          <input
            id="realname"
            type="text"
            onChange={(e) => handleRegistrationInfo(e)}
            value={ragistrationInfo.realname}
            placeholder="실명"
            className="w-128 px-4 py-3 border-2 border-slate-400 rounded-md tracking-wide"
          />
          {/* 전화번호 입력 */}
          <input
            id="phone"
            type="text"
            onChange={(e) => handleRegistrationInfo(e)}
            value={ragistrationInfo.phone}
            maxLength={13}
            placeholder="전화번호"
            className="w-128 px-4 py-3 border-2 border-slate-400 rounded-md tracking-wide"
          />
          {/* 주민등록번호 입력 */}
          <section className="flex items-center gap-2 w-128">
            {/* 주민번호 앞자리 입력 */}
            <input
              id="ssnFront"
              type="text"
              onChange={(e) => handleRegistrationInfo(e)}
              value={ragistrationInfo.ssnFront}
              maxLength={6}
              placeholder="주민번호 앞자리"
              className="w-1/2 px-4 py-3 border-2 border-slate-400 rounded-md tracking-wide"
            />
            <p className="text-slate-600">-</p>
            {/* 주민번호 뒷자리 입력 */}
            <input
              id="ssnBack"
              type="password"
              onChange={(e) => handleRegistrationInfo(e)}
              value={ragistrationInfo.ssnBack}
              maxLength={7}
              placeholder="주민번호 뒷자리"
              className="w-1/2 px-4 py-3 border-2 border-slate-400 rounded-md tracking-wide"
            />
          </section>
          {/* 주소 입력 및 주소 찾기 */}
          <section className="flex items-center gap-2 w-128">
            <input
              id="address1"
              type="text"
              onChange={(e) => handleRegistrationInfo(e)}
              value={ragistrationInfo.address1}
              placeholder="주소"
              className="w-5/6 px-4 py-3 border-2 border-slate-400 rounded-md tracking-wide"
            />
            <button
              type="button"
              className="w-1/6 h-[56px] bg-green-300 hover:bg-green-400 rounded-md text-xl text-white tracking-widest cursor-pointer select-none"
            >
              찾기
            </button>
          </section>
          {/* 상세주소 입력 */}
          <input
            id="address2"
            type="text"
            onChange={(e) => handleRegistrationInfo(e)}
            value={ragistrationInfo.address2}
            placeholder="상세 주소"
            className="w-128 px-4 py-1 -mt-2 border-2 border-slate-400 rounded-md tracking-wide"
          />
          {/* 이메일 입력 */}
          <section className="flex items-center gap-2 w-128">
            <input
              id="email"
              type="email"
              onChange={(e) => handleRegistrationInfo(e)}
              value={ragistrationInfo.email}
              placeholder="이메일"
              className="w-5/6 px-4 py-3 border-2 border-slate-400 rounded-md tracking-wide"
            />
            <button
              type="button"
              className="w-1/6 h-[56px] bg-green-300 hover:bg-green-400 rounded-md text-xl text-white tracking-widest cursor-pointer select-none"
            >
              전송
            </button>
          </section>
          {/* 인증번호 입력 */}
          <section className="flex items-center gap-2 w-128 -mt-2">
            <input
              id="verifyCode"
              type="text"
              onChange={(e) => handleVerifyCode(e)}
              value={ragistrationInfo.email}
              placeholder="이메일 인증 번호"
              className="w-5/6 px-4 py-1 border-2 border-slate-400 rounded-md tracking-wide"
            />
            <button
              type="button"
              className="w-1/6 h-[40px] bg-green-300 hover:bg-green-400 rounded-md text-xl text-white tracking-widest cursor-pointer select-none"
            >
              인증
            </button>
          </section>
          {/* 제출 버튼 */}
          <button type="submit" className="w-40 py-4 mt-4 bg-green-300 hover:bg-green-400 rounded-md text-2xl text-white cursor-pointer select-none">
            제출
          </button>
        </form>
      </div>
      {/* 플렉스 아이템 3: 네비게이션 구역 */}
      <div className="flex justify-center font-EliceDigitalBaeumB text-lg text-slate-500 select-none">
        <button type="button" onClick={() => navi("/authenticator")} className="cursor-pointer">
          로그인으로 돌아가기
        </button>
      </div>
    </>
  );
};

export default Registration;

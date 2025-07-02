import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../api/apiService";
import axios from "axios";
import {useDaumPostcodePopup} from "react-daum-postcode";
import Loading from "../Loading/Loading";
import { toast, ToastContainer } from "react-toastify";

const Registration = () => {
  const DORO_KEY = window.ENV?.DORO_KEY; 
  const navi = useNavigate();
  const open = useDaumPostcodePopup("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");
  const [registerInfo, setRegisterInfo] = useState({
    username: "",
    password: "",
    realname: "",
    email: "",
    phone: "",
    ssn: "",
    address1: "",
    address2: "",
  });
  const [emailVerify, setEmailVerify] = useState({
    email: "",
    verifyCode: "", 
  })
  const [isMailSend, setIsMailSend] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [timer]);

  // 주소 검색 클릭
  const handleAddressSearchClick = () => {
    open({ onComplete: handleAddressSearchComplete });
  }

  // 주소 검색 완료 핸들러
  const handleAddressSearchComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }
    setRegisterInfo(prev => ({
      ...prev,
      address1: fullAddress,
    }));
    console.log(fullAddress); 
  }

  // 이메일 인증 코드 전송 로직
  const handleEmailVerification = () => {
    if( isLoading ) return;
    setIsLoading(true);

    apiService.post('/emails', emailVerify, { auth: false })
      .then(response => {
        setIsLoading(false);
        console.log(response);
        if(response.data.code === "S101"){
          toast.success("인증 코드가 전송되었습니다.");
          setIsMailSend(true);
          setTimer(300);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log("이메일 인증 코드 전송 중 오류 발생:", error);
        const {message, code} = error.response?.data;
        if (code === "E101") {
          toast.error("이미 가입된 이메일입니다.");
        }
      });
  }
  const handleVerifyCode = () => {
    // 인증코드 확인 로직
    apiService.post('/emails/verify', emailVerify, { auth: false })
      .then(response => {
        console.log(response);
        if (response.data.success) {
          toast.success("인증 코드가 확인되었습니다.");
          setIsEmailVerified(true);
          setTimer(0);
          setRegisterInfo(prev => ({
            ...prev,
            email: emailVerify.email,
          }));
        }
      })
      .catch(error => {
        if(error.response?.data?.code === "E104") {
          toast.error(error.response.data.message || "인증 코드가 일치하지 않습니다.");
        }
      });
  }

  const handleRegister = () => {
    // 회원가입 처리 로직
    for (const [key, value] of Object.entries(registerInfo)) {
      if (value === null || value.trim() === "" || value === undefined) {
        toast.error(`빈칸 없이 입력해주세요.`);
        return;
      }
    }

    if (!isEmailVerified) {
      toast.error("이메일 인증을 완료해주세요.");
      return;
    }

    apiService.post('/users/join', registerInfo, { auth: false })
      .then(response => {
        console.log(response);
        if (response.data.success) {
          toast.success("회원가입이 완료되었습니다.");
          navi("/authenticator");
        }
      })
      .catch(error => {
        console.error("회원가입 중 오류 발생:", error);
        const { message, code } = error.response?.data
        if( code === "E100" ) {
          toast.error("이미 존재하는 아이디입니다.");
        }
      });
  }

  // 타이머 포맷 함수
  const formatTimer = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // 주민번호 마스킹 함수
  const maskSSN = (value) => {
    if (value.length < 7) return value;
    return value.slice(0, 8) + value.slice(8).replace(/\d/g, '*');
  };


  const handleSSNChange = (e) => {
    let input = e;
    let raw = registerInfo.ssn;

    if( raw.length == 6 ) {
      raw += "-"; 
    }

    raw += input.slice(-1);
    setRegisterInfo(prev => ({
      ...prev,
      ssn: raw,
    }));
  }

  const handlePhoneChange = (e) => {
    let input = e;

    if (input.length === 3 || input.length === 8) { 
      input += "-"; 
    }
    setRegisterInfo(prev => ({
      ...prev,
      phone: input,
    }));
  }

  return (
    <>
      {isLoading && (
        <Loading />
      )}
      
      <section className="mt-12 text-6xl flex flex-col gap-6">
        <div className="text-6xl">Registration</div>
        <div className="text-2xl text-gray-500 flex justify-center">For New User</div>
      </section>

      {/* 회원가입 정보입력 섹션 */}
      <section className="size-full mt-12 font-PyeojinGothicB flex flex-col gap-6">
        {/* 아이디 */}
        <div className="px-24">
          <input 
            id="username" 
            type="text" 
            placeholder="사번" 
            className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg"
            onChange={(e) => setRegisterInfo(prev => ({
              ...prev,
              username: e.target.value,
            }))} 
            value={registerInfo.username}
          />
        </div>

        {/* 비밀번호 */}
        <div className="px-24">
          <input 
            id="password" 
            type="password" 
            placeholder="비밀번호" 
            className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg" 
            onChange={(e) => setRegisterInfo(prev => ({
              ...prev,
              password: e.target.value,
            }))}
            value={registerInfo.password}
          />
        </div>

        {/* 실명 */}
        <div className="px-24">
          <input 
            id="realname" 
            type="text" 
            placeholder="이름" 
            className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg"
            onChange={(e) => setRegisterInfo(prev => ({
              ...prev,
              realname: e.target.value,
            }))}
            value={registerInfo.realname}
          />
        </div>

        {/* 전화번호 */}
        <div className="px-24">
          <input 
            id="phone" 
            type="text" 
            placeholder="전화번호" 
            className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg" 
            onChange={(e) => handlePhoneChange(e.target.value)}  
            value={registerInfo.phone}
            maxLength={13}
          />
        </div>
        
        {/* 주민번호 */}
        <div className="px-24">
        <input 
            id="ssn" 
            type="text" 
            placeholder="주민번호" 
            className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg" 
            onChange={e => handleSSNChange(e.target.value)}
            value={maskSSN(registerInfo.ssn)}
            maxLength={14}
          />
        </div>

        {/* 주소 입력 */}
        <div className="px-24 flex flex-col gap-4">
          <div className="flex gap-2">
            <input 
              id="address1" 
              type="text" 
              placeholder="주소"
              className="w-4/5 h-full p-4 text-xl border-2 border-gray-400 rounded-lg" 
              value={registerInfo.address1}
            />
            <button type="button" className="w-1/5 h-full text-xl text-white bg-saintragreen rounded-lg" onClick={() => handleAddressSearchClick()}>
              Search
            </button>
          </div>
          <div className="">
            <input 
              id="address2" 
              type="text" 
              placeholder="상세 주소" 
              className="size-full px-4 py-2 text-xl border-2 border-gray-400 rounded-lg" 
              value={registerInfo.address2}
              onChange={(e) => setRegisterInfo(prev => ({
                ...prev,
                address2: e.target.value,
              }))}  
            />
          </div>
        </div>

        {/* 이메일 */}
        <div className="px-24 flex flex-col gap-4">
          <div className="flex flex-col">
            <div className="flex gap-2">
              <input 
                id="email" 
                type="email" 
                placeholder="이메일" 
                className="w-4/5 h-full p-4 text-xl border-2 border-gray-400 rounded-lg disabled:bg-saintrablack/30" 
                onChange={(e) => setEmailVerify(prev => ({
                  ...prev,
                  email: e.target.value,
                }))}
                value={emailVerify.email}
                disabled={isEmailVerified}
              />
              <button
                type="button"
                className="w-1/5 h-full text-xl text-white bg-saintragreen rounded-lg flex items-center justify-center active:scale-90 cursor-pointer disabled:bg-saintragreen/50"
                onClick={handleEmailVerification}
                disabled={isLoading || isEmailVerified}
              >
                {isLoading ? (
                  <svg className="animate-spin h-6 w-6 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <span>{!isMailSend ? "전송" : "재전송"}</span>
                )}
              </button> 
            </div>
            { timer > 0 && 
              <span className="m-0 p-0 flex flex-row justify-end">{formatTimer(timer)}</span> 
            }
          </div>
          <div className="flex gap-2">
            <input 
              id="verifyCode" 
              type="text" 
              placeholder="인증 번호" 
              className="w-4/5 h-full px-4 py-2 text-xl border-2 border-gray-400 rounded-lg disabled:bg-saintrablack/30" 
              onChange={(e) => setEmailVerify(prev => ({
                ...prev,
                verifyCode: e.target.value,
              }))}
              value={emailVerify.verifyCode}
              disabled={isEmailVerified}
            />
            <button 
              type="button" 
              className="w-1/5 h-full text-xl text-white bg-saintragreen rounded-lg disabled:bg-saintragreen/50 cursor-pointer active:scale-90" 
              onClick={() => handleVerifyCode()} 
              disabled={isEmailVerified}>
              Verify
            </button>
          </div>
        </div>

      </section>
      <section className="mt-12">
        <button 
          type="submit" 
          className="w-48 h-20 text-3xl text-white bg-saintragreen rounded-xl disabled:bg-saintragreen/50 cursor-pointer"
          onClick={() => handleRegister()}
          disabled={!isEmailVerified}
        >
          가입하기
        </button>
      </section>
      <section className="my-12 text-lg text-gray-500 cursor-pointer hover:text-gray-600 active:scale-95 select-none">
        <div onClick={() => navi("/authenticator")}>Go Back to Authenticator</div>
      </section>
    </>
  );
};

export default Registration;
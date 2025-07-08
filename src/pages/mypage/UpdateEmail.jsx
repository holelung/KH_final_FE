import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../api/apiService";
import { toast } from "react-toastify";

const UpdateEmail = () => {
  const navi = useNavigate();
  const [emailVerify, setEmailVerify] = useState({
    email: "",
    verifyCode: "",
  });
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

  const formatTimer = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

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
        }else if (code === "E400") {
          toast.error("올바른 이메일 형식이 아닙니다.");
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
  
  const updateHandler = () => {
    if( !isEmailVerified ) {
      toast.error("이메일 인증을 완료해주세요.");
      return;
    }

    apiService.patch('/users/email',{
      email: emailVerify.email,
    }).then(response => {
      if(response.data.code === "S202") {
        toast.success("이메일이 성공적으로 변경되었습니다.");
        navi('/mypage');
      }
    }).catch(error => {
      toast.error(error.response?.data?.message || "이메일 변경에 실패했습니다.");
    })

  }

  return (
    <>
      <div className="flex flex-col items-center">
        <h2 className="font-PretendardB text-2xl">EMAIL UPDATE</h2>
        {/* 이메일 */}
        <section className="size-full mt-12 font-PyeojinGothicB flex flex-col gap-6">
          <div className="px-24 flex flex-col">
            <div className="flex gap-2">
              <input 
                id="email" 
                type="email" 
                placeholder="새로운 이메일" 
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
                className="w-1/5 h-full p-4 text-xl text-white bg-saintragreen rounded-lg flex items-center justify-center active:scale-90 cursor-pointer disabled:bg-saintragreen/50"
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
          <div className="px-24 flex gap-2">
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
              className="w-1/5 h-full p-2 text-xl text-white bg-saintragreen rounded-lg disabled:bg-saintragreen/50 cursor-pointer active:scale-90" 
              onClick={() => handleVerifyCode()} 
              disabled={isEmailVerified}>
              Verify
            </button>
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

export default UpdateEmail;
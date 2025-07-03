import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { apiService } from "../../api/apiService";



const Login = () => {
  const {login} = useContext(AuthContext)
  const navi = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    "username":'',
    "password":'',
  });

  const loginHandler = () => {
    apiService.post('auth/tokens',
      loginInfo,
      { auth: false }
    ).then(response => {
      console.log(response);
      login(response.data.data.loginInfo, response.data.data.tokens);
    });
  }
  
  return (
    <>
      <section className="mt-12 text-6xl flex flex-col gap-6">
        <div className="text-6xl">Login</div>
        <div className="text-2xl text-gray-500 flex justify-center">Welcome!</div>
      </section>
      <section className="size-full mt-12 font-PyeojinGothicB flex flex-col gap-6">
        <div className="px-24">
          <input 
            id="username" 
            type="text" 
            placeholder="USERNAME" 
            className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg"
            onChange={(e) => setLoginInfo(prev => ({
              ...prev,
              username: e.target.value,
            }))}
          />
        </div>
        <div className="px-24">
          <input 
            id="password" 
            type="password" 
            placeholder="PASSWORD" 
            className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg" 
            onChange={(e) => setLoginInfo(prev => ({
              ...prev,
              password: e.target.value,
            }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                loginHandler();
              }
            }}
          />
        </div>
      </section>
      <section className="mt-12">
        <button className="w-48 h-20 text-3xl text-white bg-saintragreen rounded-xl cursor-pointer hover:opacity-90 active:scale-95" onClick={() => loginHandler()}>Login</button>
      </section>
      <section className="my-12 text-lg text-gray-500 flex gap-4">
        <div 
          onClick={() => navi('/authenticator/registration')}
          className="cursor-pointer select-none hover:text-saintradarkblue active:scale-95"
        >Registration</div>
        <div className="select-none">|</div>
        <div 
          onClick={() => navi('/authenticator/reissue-password')}
          className="cursor-pointer select-none hover:text-saintradarkblue active:scale-95"
        >Reissue Password</div>
      </section>
    </>
  );
}

export default Login;
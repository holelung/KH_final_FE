import axios from "axios";
import { toast } from "react-toastify"


const API_URL = window.ENV?.API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: accessToken 삽입
// Token 안넣는 법
// apiService.get("/public/notice", { auth: false });
axiosInstance.interceptors.request.use(
  (config) => {
    const requireAuth = config.auth !== false;
    
    if (requireAuth) {
      const raw = sessionStorage.getItem("tokens");
      const tokens = raw ? JSON.parse(raw) : null;
      if (tokens) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
)

// 응답 인터셉터: 공통 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error.response;
    const { success, code, message } = res?.data;
  
    if (success === false) {
      console.error(`안내 [${res.status}, ${code}]: ${message}`);
    }
  

    switch (code) {
      case "E401":
        toast.error("로그인이 만료되었습니다.");
        sessionStorage.clear();
        window.location.href = "/login";
        break;
      case "E100":
        toast.error("아이디가 중복되었습니다.");
        break;
      case "E101":
        toast.error("이메일이 중복되었습니다.");
        break;
      case "E500":
        console.log(message);
    }
    return Promise.reject(error);
  }
)

export default axiosInstance;
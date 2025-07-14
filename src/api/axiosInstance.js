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

      // token 이 없을경우 예외처리
      // if (!raw) {
      //   return Promise.reject(new TokenMissingError());
      // }

      const tokens = raw ? JSON.parse(raw) : null;
      if (tokens) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
)

function refresh() {
  const raw = sessionStorage.getItem("tokens");
  console.log(raw);
  if(!raw) throw new Error("토큰이 없습니다");

  const tokens = raw ? JSON.parse(raw) : null;
  const refreshToken = tokens.refreshToken;

  axios.post(`${API_URL}/auth/refresh`, 
    {},
    {
    headers:{
      Authorization: `Bearer ${refreshToken}`,
    }
  }).then(response => {
    console.log("refresh Token요청 응답", response);
    const accessToken = response.data.data.accessToken;
    const refreshToken = response.data.data.refreshToken;
    const newTokens = {
      "accessToken":accessToken,
      "refreshToken":refreshToken,
    }

    sessionStorage.setItem("tokens", JSON.stringify(newTokens))
    return newTokens.accessToken;
  });
}


// 응답 인터셉터: 공통 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {

    const res = error.response;
    const status = res?.status;
    const { success, code, message } = res?.data;

    if (res.status === 401 && res.data.code === 'TOKEN_EXPIRED') {
      try {
        const newToken = refresh();
        console.log(newToken);

        axiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`;
        error.config.headers.Authorization = `Bearer ${newToken}`;
        
        return axiosInstance(error.config);
      } catch (refreshError) {
        // 리프레시도 실패하면 로그인 페이지로
        sessionStorage.removeItem("tokens");
        sessionStorage.removeItem("loginInfo");
        return Promise.reject(refreshError);
      }
    }

    switch (code) {
      case "E100":
        toast.error("아이디가 중복되었습니다.");
        break;
      case "E500":
        console.error(error);
      case "E502":
        console.error(error);
    }
    return Promise.reject(error);
  }
)

export default axiosInstance;
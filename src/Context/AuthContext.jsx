import { useState, useEffect, createContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navi = useNavigate();
  const [auth, setAuth] = useState({
    loginInfo: {},
    tokens: {},
    isLoading: true,
    isAuthenticated: false,
  });

  // STOMP client
  const clientRef = useRef(null);

  // 세션에 이미 로그인 정보가 있으면 context 초기화
  useEffect(() => {
    const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
    const tokens = JSON.parse(sessionStorage.getItem("tokens"));
    if (loginInfo && tokens) {
      setAuth({
        loginInfo,
        tokens,
        isLoading: false,
        isAuthenticated: true,
      });
    }
  }, []);

  // 2) auth.isAuthenticated 바뀔 때마다 소켓 connect/disconnect
  useEffect(() => {
    if (auth.isAuthenticated) {
      // 로그인 시 -> 소켓 연결
      const token = auth.tokens.accessToken;
      const stompHeaders = {
        "username": auth.loginInfo.username,
        "status":"online",
      }
      const client = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 5000,
        debug: () => {},
        onConnect: () => {
          console.log("WS connected");
          // 예: /topic/users 구독
          client.subscribe("/topic/users", frame => {
            console.log("구독");
          }, stompHeaders);
        },
        onStompError: err => console.error(err),
      });
      client.activate();
      clientRef.current = client;
    } else {
      // 로그아웃 시 -> 소켓 해제
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
    }
    // cleanup on unmount
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
    };
  }, [auth.isAuthenticated]);

  const login = (loginInfo, tokens) => {
    setAuth({
      loginInfo,
      tokens,
      isAuthenticated: true,
      isLoading: false,
    });
    sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));
    sessionStorage.setItem("tokens", JSON.stringify(tokens));
    console.log(JSON.stringify(tokens));
    console.log(JSON.stringify(loginInfo));
    
    toast.success("로그인 되었습니다.");
    navi("/");
  };

  const logout = () => {
    setAuth({
      loginInfo: {},
      tokens: {},
      isLoading: true,
      isAuthenticated: false,
    });
    sessionStorage.removeItem("loginInfo");
    sessionStorage.removeItem("tokens");
    navi("/authenticator");
    toast.info("로그아웃 되었습니다.");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, stompClient: clientRef }}>
      {children}
    </AuthContext.Provider>);
};

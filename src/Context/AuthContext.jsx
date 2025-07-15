import { useState, useEffect, createContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navi = useNavigate();
  const [auth, setAuth] = useState({
    loginInfo: {},
    tokens: {},
    isLoading: true,
    isAuthenticated: false,
  });

  // STOMP URL
  const STOMP_URL = window.ENV?.STOMP_URL;

  // STOMP client
  const clientRef = useRef(null);

  const savedStatus = sessionStorage.getItem("connectedUsers")
    ? JSON.parse(sessionStorage.getItem("connectedUsers")).find((u) =>
        u.username == sessionStorage.getItem("loginInfo") ? JSON.parse(sessionStorage.getItem("loginInfo")).username : "OFFLINE"
      ).status
    : "OFFLINE";
  const statusRef = useRef(savedStatus || "ONLINE");
  const [connectedUsers, setConnectedUsers] = useState([]);

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
        username: auth.loginInfo.username,
        status: statusRef.current,
      };
      const client = new Client({
        webSocketFactory: () => new SockJS(STOMP_URL),
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 5000,
        debug: () => {},
        onConnect: () => {
          console.log("WS connected");
          // 예: /topic/users 구독
          client.subscribe(
            "/topic/users",
            (frame) => {
              console.log("socket Subscribe success!");
              const users = JSON.parse(frame.body);
              setConnectedUsers(users);
              sessionStorage.setItem("connectedUsers", JSON.stringify(users));
            },
            stompHeaders
          );
        },
        onStompError: (err) => console.error(err),
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

  return <AuthContext.Provider value={{ auth, login, logout, stompClient: clientRef, connectedUsers, userStatus: statusRef }}>{children}</AuthContext.Provider>;
};

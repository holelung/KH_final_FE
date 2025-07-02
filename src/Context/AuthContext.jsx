import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navi = useNavigate();
  const [auth, setAuth] = useState({
    loginInfo: {},
    tokens: {},
    isLoading: true,
    isAuthenticated: false,
  });

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
  };

  return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
};

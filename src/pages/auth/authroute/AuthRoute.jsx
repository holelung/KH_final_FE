import { useContext, useEffect } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthRoute = ({ children }) => {
  const loginInfoString = sessionStorage.getItem("loginInfo");

  if(!loginInfoString) {
    return <Navigate to="/authenticator" replace />
  }

  return children;
};

export default AuthRoute;

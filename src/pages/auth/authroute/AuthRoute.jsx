import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.isAuthenticated) {
    toast.info("로그인 하세요!");
    return <Navigate to={"/authenticator"} replace />;
  }
  return children;
};

export default AuthRoute;

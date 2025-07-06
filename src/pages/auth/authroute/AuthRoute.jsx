import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.isAuthenticated) {
    alert("로그인 하세요!");
    return <Navigate to={"/authenticator"} replace />;
  }
  return children;
};

export default AuthRoute;

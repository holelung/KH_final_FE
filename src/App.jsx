import "./App.css";
import { AuthProvider } from "./Context/AuthContext";
import { Routes, Route } from "react-router-dom";
import Authenticator from "./pages/auth/authenticator/Authenticator";
import DisplayArea from "./pages/include/displayarea/DisplayArea";
import Test from "./pages/Home/Test";
import BoardList from "./pages/board/BoardList";
import Includes from "./pages/include/includes/Includes";
import AuthRoute from "./pages/auth/authroute/AuthRoute";
import Login from "./Components/auth/Login";
import Registration from "./Components/auth/Registration";
import ReissuePassword from "./Components/auth/ReissuePassword";
import { ToastContainer } from "react-toastify";
import PasswordReset from "./Components/auth/PasswordReset";

function App() {
  return (
    <AuthProvider>
      <ToastContainer 
        position="bottom-right"/>
      <Routes>
        <Route path="/authenticator" element={<Authenticator />} >
          <Route index element={<Login />} />
          <Route path="registration" element={<Registration />} />
          <Route path="reissue-password" element={<ReissuePassword />} /> 
          <Route path="password-reset" element={<PasswordReset />} />
        </Route>
        

        <Route
          element={
            // <AuthRoute>
            <Includes />
            // </AuthRoute>
          }
        >
          <Route path="/" element={<DisplayArea children={<></>} />} />
          <Route path="/test" element={<DisplayArea children={<Test />} />} />
          <Route path="/boards" element={<DisplayArea children={<BoardList />} />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

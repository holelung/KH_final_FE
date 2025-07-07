import "./App.css";
import { AuthProvider } from "./Context/AuthContext";
import { Routes, Route } from "react-router-dom";
import Authenticator from "./pages/auth/authenticator/Authenticator";
import DisplayArea from "./pages/include/displayarea/DisplayArea";
import Test from "./pages/Home/Test";
import BoardList from "./pages/board/boardlist/BoardList";
import Includes from "./pages/include/includes/Includes";
import AuthRoute from "./pages/auth/authroute/AuthRoute";
import UnifiedCalendar from "./pages/calendar/UnifiedCalendar";
import GroupChat from "./pages/chat/GroupChat";
import Login from "./Components/auth/Login";
import Registration from "./Components/auth/Registration";
import ReissuePassword from "./Components/auth/ReissuePassword";
import { ToastContainer } from "react-toastify";
import PasswordReset from "./Components/auth/PasswordReset";
import Mypage from "./pages/mypage/Mypage";
import MypageDisplay from "./pages/mypage/MypageDisplay";
import ModifyProfile from "./pages/mypage/ModifyProfile";
import UpdatePassword from "./pages/mypage/UpdatePassword";
import UpdateEmail from "./pages/mypage/UpdateEmail";
import UserAttendance from "./pages/mypage/UserAttendance";
import BoardEditer from "./pages/board/boardediter/BoardEditer";
import DepartmentList from "./pages/department/DepartmentList";
import BoardDetail from "./pages/board/boarddetail/BoardDetail";
import DepartmentDetail from "./pages/department/departmentdetail/DepartmentDetail";

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="bottom-right" />
      <Routes>
        <Route path="/authenticator" element={<Authenticator />}>
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
          <Route path="/" element={<></>} />
          <Route path="/test" element={<Test />} />
          <Route path="/boards" element={<BoardList />} />
          <Route path="/calendar" element={<DisplayArea children={<UnifiedCalendar />} />} />
          <Route path="/chat" element={<DisplayArea children={<GroupChat />} />} />
          <Route path="/mypage" element={<MypageDisplay />}>
            <Route index element={<Mypage />} />
            <Route path="modifyProfile" element={<ModifyProfile />} />
            <Route path="updatePassword" element={<UpdatePassword />} />
            <Route path="updateEmail" element={<UpdateEmail />} />
            <Route path="attendance" element={<UserAttendance />} />
          </Route>
          <Route path="/" element={<></>} />
          <Route path="/test" element={<Test />} />
          <Route path="/boards" element={<BoardList />} />
          <Route path="/boards/edit" element={<BoardEditer />} />
          <Route path="/boards/detail" element={<BoardDetail />} />
          <Route path="/department" element={<DepartmentList />} />
          <Route path="/department/:id" element={<DepartmentDetail />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

import "./App.css";
import { AuthProvider } from "./Context/AuthContext";
import { Routes, Route } from "react-router-dom";
import Test from "./pages/Home/Test";
import BoardList from "./pages/board/boardlist/BoardList";
import AuthRoute from "./pages/auth/authroute/AuthRoute";
import UnifiedCalendar from "./pages/calendar/UnifiedCalendar";
import GroupChat from "./pages/chat/GroupChat";
import { ToastContainer } from "react-toastify";
import Mypage from "./pages/mypage/Mypage";
import MypageDisplay from "./pages/mypage/MypageDisplay";
import ModifyProfile from "./pages/mypage/ModifyProfile";
import UpdatePassword from "./pages/mypage/UpdatePassword";
import UpdateEmail from "./pages/mypage/UpdateEmail";
import UserAttendance from "./pages/mypage/UserAttendance";
import ChatRoomList from "./pages/chat/ChatRoomList";
import CalendarForm from "./pages/calendar/CalendarForm";
import MeetingRoomCalendar from "./pages/meetingRoom/MeetingRoomCalendar";
import MeetingRoomForm from "./pages/meetingRoom/MeetingRoomForm";
import BoardEditer from "./pages/board/boardediter/BoardEditer";
import DepartmentList from "./pages/department/DepartmentList";
import BoardDetail from "./pages/board/boarddetail/BoardDetail";
import DepartmentDetail from "./pages/department/departmentdetail/DepartmentDetail";
import ApproveJoin from "./pages/admin/ApproveJoin";
import Log from "./pages/admin/Log";
import UserManage from "./pages/admin/UserManage";
import Grid from "./Components/layout/grid/Grid";
import AuthContainer from "./Components/authlayout/authcontainer/AuthContainer";
import Login from "./Components/authlayout/login/Login";
import Registration from "./Components/authlayout/registration/Registration";

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="bottom-right" />
      <Routes>
        <Route path="/authenticator" element={<AuthContainer />}>
          <Route index element={<Login />} />
          <Route path="registration" element={<Registration />} />
        </Route>

        <Route
          element={
            <AuthRoute>
              <Grid />
            </AuthRoute>
          }
        >
          <Route path="/" element={<></>} />
          <Route path="/test" element={<Test />} />
          <Route path="/calendar" element={<UnifiedCalendar />} />
          <Route path="/calendar/write" element={<CalendarForm />} />
          <Route path="/meetingroom" element={<MeetingRoomCalendar />} />
          <Route path="/meetingroom/write" element={<MeetingRoomForm />} />
          <Route path="/chat" element={<ChatRoomList />} />
          <Route path="/chat/:teamId" element={<GroupChat />} />
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
          <Route path="approve-join" element={<ApproveJoin />} />
          <Route path="user-manage" element={<UserManage />} />
          <Route path="log" element={<Log />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

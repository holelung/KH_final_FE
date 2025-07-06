import "./App.css";
import { AuthProvider } from "./Context/AuthContext";
import { Routes, Route } from "react-router-dom";
import Authenticator from "./pages/auth/authenticator/Authenticator";
import Register from "./pages/auth/register/Register";
import DisplayArea from "./pages/include/displayarea/DisplayArea";
import Test from "./pages/Home/Test";
import BoardList from "./pages/board/boardlist/BoardList";
import Includes from "./pages/include/includes/Includes";
import AuthRoute from "./pages/auth/authroute/AuthRoute";
import BoardEditer from "./pages/board/boardediter/BoardEditer";
import DepartmentList from "./pages/department/DepartmentList";
import BoardDetail from "./pages/board/boarddetail/BoardDetail";
import DepartmentDetail from "./pages/department/departmentdetail/DepartmentDetail";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/authenticator" element={<Authenticator />} />
        <Route path="/register" element={<Register />} />
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
          <Route path="/boards/edit" element={<DisplayArea children={<BoardEditer />} />} />
          <Route path="/boards/detail" element={<DisplayArea children={<BoardDetail />} />} />
          <Route path="/department" element={<DisplayArea children={<DepartmentList />} />} />
          <Route path="/department/:id" element={<DisplayArea children={<DepartmentDetail />} />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

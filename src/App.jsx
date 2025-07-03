import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import Authenticator from "./pages/auth/authenticator/Authenticator";
import DisplayArea from "./pages/include/displayarea/DisplayArea";
import Test from "./pages/Home/Test";
import Includes from "./pages/include/includes/Includes";
import AuthRoute from "./pages/auth/authroute/AuthRoute";
import Login from "./Components/auth/Login";
import Registration from "./Components/auth/Registration";
import ReissuePassword from "./Components/auth/ReissuePassword";
import { ToastContainer } from "react-toastify";

// 익명 게시판 관련
import BoardList from "./pages/anonymous/BoardList";
import BoardWrite from "./pages/anonymous/BoardWrite";
import BoardDetail from "./pages/anonymous/BoardDetail";

// 인증된 유저용 게시판
import AuthBoardList from "./pages/board/BoardList";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="bottom-right" />

        {/* 상단 네비게이션 */}
        <nav
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #ccc",
            padding: "10px 20px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Link to="/" style={{ marginRight: "20px", textDecoration: "none", color: "#333" }}>
            📋 홈
          </Link>
          <Link to="/boards" style={{ marginRight: "20px", textDecoration: "none", color: "#333" }}>
            🔐 게시판
          </Link>
          <Link to="/write" style={{ marginRight: "20px", textDecoration: "none", color: "#333" }}>
            ✏️ 글쓰기
          </Link>
        </nav>

        <Routes>
          {/* 인증 관련 */}
          <Route path="/authenticator" element={<Authenticator />} >
            <Route index element={<Login />} />
            <Route path="registration" element={<Registration />} />
            <Route path="reissue-password" element={<ReissuePassword />} />
          </Route>

          {/* 인증된 사용자용 라우팅 (AuthRoute 필요 시 활성화) */}
          <Route
            element={
              // <AuthRoute>
              <Includes />
              // </AuthRoute>
            }
          >
            <Route path="/test" element={<DisplayArea children={<Test />} />} />
            <Route path="/boards" element={<DisplayArea children={<AuthBoardList />} />} />
          </Route>

          {/* 익명 게시판 */}
          <Route path="/" element={<BoardList />} />
          <Route path="/write" element={<BoardWrite />} />
          <Route path="/board/:id" element={<BoardDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import BoardList from "./pages/anonymous/BoardList";
import BoardWrite from "./pages/anonymous/BoardWrite";
import BoardDetail from "./pages/anonymous/BoardDetail";

function App() {
  return (
    <Router>
      {/* 전체 레이아웃 */}
      <div
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          minHeight: "100vh",
          backgroundColor: "#f9f9f9",
        }}
      >
        {/* 상단 네비게이션 */}
        <nav
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
          }}
        >
          <Link
            to="/"
            style={{
              marginRight: "20px",
              textDecoration: "none",
              color: "#333",
            }}
          >
            📋 목록
          </Link>
          <Link to="/write" style={{ textDecoration: "none", color: "#333" }}>
            ✏️ 글쓰기
          </Link>
        </nav>

        {/* 라우터 영역 */}
        <Routes>
          <Route path="/" element={<BoardList />} />
          <Route path="/write" element={<BoardWrite />} />
          <Route path="/board/:id" element={<BoardDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

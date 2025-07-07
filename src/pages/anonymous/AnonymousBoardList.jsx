import { useEffect, useState } from "react";
import axios from "axios";
import { fetchAllBoards, fetchMyBoards } from "../../api/anonymousBoardApi";
import { getUserId } from "../../utils/userUtils";

function AnonymousBoardList() {
  const [boards, setBoards] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [showMine, setShowMine] = useState(false);
  const myUserId = getUserId();

  const loadBoards = () => {
    const url = showMine ? `http://localhost:8080/api/board/my?userId=${myUserId}` : `http://localhost:8080/api/board`;

    axios
      .get(url)
      .then((res) => setBoards(res.data))
      .catch((err) => console.error("목록 조회 실패:", err));
  };

  useEffect(loadBoards, [showMine]);

  const handleSearch = () => {
    if (!keyword.trim()) {
      loadBoards();
      return;
    }

    const url = showMine
      ? `http://localhost:8080/api/board/search/my?keyword=${encodeURIComponent(keyword)}&userId=${myUserId}`
      : `http://localhost:8080/api/board/search?keyword=${encodeURIComponent(keyword)}`;

    axios
      .get(url)
      .then((res) => setBoards(res.data))
      .catch((err) => {
        console.error("검색 실패:", err);
        alert("검색 중 오류 발생");
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>익명 게시판 목록</h2>

      {/* 검색창 */}
      <div style={{ marginBottom: 20 }}>
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="제목·내용 검색" style={{ padding: 6, width: 260 }} />
        <button onClick={handleSearch} style={{ marginLeft: 10 }}>
          검색
        </button>

        {/* 내 글만 보기 토글 */}
        <label style={{ marginLeft: 30 }}>
          <input type="checkbox" checked={showMine} onChange={() => setShowMine((prev) => !prev)} /> 내가 쓴 글만 보기
        </label>
      </div>

      {/* 게시글 목록 */}
      <ul>
        {boards.length ? (
          boards.map((b) => (
            <li key={b.id}>
              <strong>{b.title}</strong> (작성일 {new Date(b.createDate).toLocaleDateString()})
            </li>
          ))
        ) : (
          <p>게시글이 없습니다.</p>
        )}
      </ul>
    </div>
  );
}

export default AnonymousBoardList;

import { useEffect, useState } from "react";
import { fetchAllBoards, fetchMyBoards } from "../../api/boardApi";
import { getUserId } from "../../utils/userUtils";

function BoardList() {
  const [boards, setBoards] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [showMine, setShowMine] = useState(false); // 🔑 토글 상태
  const myUserId = getUserId();

  /** 전체 또는 내 글 불러오기 */
  const loadBoards = () => {
    const api = showMine ? fetchMyBoards(myUserId) : fetchAllBoards();
    api
      .then((res) => {
        setBoards(res.data);
      })
      .catch((err) => console.error("목록 조회 실패:", err));
  };

  /** 최초 & showMine 변경 시 재호출 */
  useEffect(loadBoards, [showMine]);

  /** 검색 → showMine 여부에 맞춰 API 호출 */
  const handleSearch = () => {
    if (!keyword.trim()) {
      loadBoards();
      return;
    }
    const url = showMine
      ? `/api/board/search/my?keyword=${encodeURIComponent(
          keyword
        )}&userId=${myUserId}`
      : `/api/board/search?keyword=${encodeURIComponent(keyword)}`;
    axios.get(url).then((res) => setBoards(res.data));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>익명 게시판 목록</h2>

      {/* 🔍 검색창 */}
      <div style={{ marginBottom: 20 }}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="제목·내용 검색"
          style={{ padding: 6, width: 260 }}
        />
        <button onClick={handleSearch} style={{ marginLeft: 10 }}>
          검색
        </button>

        {/* ✅ ‘내 글만’ 토글 */}
        <label style={{ marginLeft: 30 }}>
          <input
            type="checkbox"
            checked={showMine}
            onChange={() => setShowMine((prev) => !prev)}
          />{" "}
          내가 쓴 글만 보기
        </label>
      </div>

      {/* 목록 */}
      <ul>
        {boards.length ? (
          boards.map((b) => (
            <li key={b.id}>
              <strong>{b.title}</strong> (작성일{" "}
              {new Date(b.createDate).toLocaleDateString()})
            </li>
          ))
        ) : (
          <p>게시글이 없습니다.</p>
        )}
      </ul>
    </div>
  );
}

export default BoardList;

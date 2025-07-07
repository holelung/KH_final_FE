import { useEffect, useState } from "react";
import axios from "axios";

function AnonymousBoardList() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/board")
      .then((res) => setBoards(res.data))
      .catch((err) => console.error("게시글 목록 불러오기 실패:", err));
  }, []);

  return (
    <div className="p-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 text-left">번호</th>
            <th className="py-2 px-4 text-left">제목</th>
            <th className="py-2 px-4 text-left">작성일</th>
          </tr>
        </thead>
        <tbody>
          {boards.length > 0 ? (
            boards.map((b, i) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{i + 1}</td>
                <td className="py-2 px-4">{b.title}</td>
                <td className="py-2 px-4">{new Date(b.createDate).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4 text-gray-500">
                게시글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AnonymousBoardList;

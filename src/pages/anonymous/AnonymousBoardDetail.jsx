import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserId } from "../../utils/userUtils";
import { fetchFilesByBoardId, downloadFileUrl } from "../../api/anonymousFileApi";
import CommentList from "./AnonymousCommentList";
import axios from "axios";

function AnonymousBoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [files, setFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const myUserId = getUserId();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/board/${id}`)
      .then((res) => {
        setBoard(res.data);
        setEditTitle(res.data.title);
        setEditContent(res.data.content);
      })
      .catch(() => navigate("/anonymous"));

    fetchFilesByBoardId(id)
      .then((res) => setFiles(res.data))
      .catch(console.error);
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/board/${id}`, {
        title: editTitle,
        content: editContent,
      });
      alert("수정 완료");
      setIsEditing(false);
      setBoard({ ...board, title: editTitle, content: editContent });
    } catch {
      alert("수정 중 오류 발생");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/board/${id}`);
      alert("삭제 완료");
      navigate("/anonymous");
    } catch {
      alert("삭제 실패");
    }
  };

  if (!board) return <p>로딩 중...</p>;

  const isMine = board.userId === myUserId;

  return (
    <div className="p-4 space-y-4">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-2">
          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full p-2 border rounded" />
          <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full h-40 p-2 border rounded" />
          <div className="space-x-2">
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
              저장
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-300 rounded">
              취소
            </button>
          </div>
        </form>
      ) : (
        <>
          <h2 className="text-xl font-semibold">{board.title}</h2>
          <p className="text-gray-500">익명 | {new Date(board.createDate).toLocaleDateString()}</p>
          <p>{board.content}</p>

          {files.length > 0 && (
            <div>
              <h4 className="mt-4">📎 첨부파일</h4>
              <ul className="list-disc ml-5">
                {files.map((f) => (
                  <li key={f.id}>
                    <a href={downloadFileUrl(f.id)} download>
                      {f.originalFileName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isMine && (
            <div className="space-x-2 mt-4">
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-500 text-white rounded">
                수정
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">
                삭제
              </button>
            </div>
          )}
        </>
      )}

      <CommentList boardId={id} />
    </div>
  );
}

export default AnonymousBoardDetail;

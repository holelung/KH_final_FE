import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { getUserId } from "../../utils/userUtils";
import { fetchFilesByBoardId, downloadFileUrl } from "../../api/anonymousFileApi";
import CommentList from "./AnonymousCommentList";

function AnonymousBoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const myUserId = getUserId();

  const [board, setBoard] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/board/${id}`)
      .then((res) => {
        setBoard(res.data);
        setEditTitle(res.data.title);
        setEditContent(res.data.content);
      })
      .catch((err) => {
        console.error("조회 실패:", err);
        alert("게시글을 불러오는 데 실패했습니다.");
        navigate("/");
      });

    fetchFiles();
  }, [id, navigate]);

  const fetchFiles = () => {
    fetchFilesByBoardId(id)
      .then((res) => setFiles(res.data))
      .catch((err) => console.error("첨부파일 조회 실패:", err));
  };

  const handleDelete = () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    axios
      .delete(`http://localhost:8080/api/board/${id}`)
      .then(() => {
        alert("게시글이 삭제되었습니다.");
        navigate("/");
      })
      .catch((err) => {
        console.error("삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8080/api/board/${id}`, { title: editTitle, content: editContent })
      .then(() => {
        alert("수정 완료");
        setBoard({ ...board, title: editTitle, content: editContent });
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("수정 실패:", err);
        alert("수정 중 오류 발생");
      });
  };

  if (!board) return <p>게시글 로딩 중...</p>;

  const isMyPost = board.userId === myUserId;

  return (
    <div style={{ padding: "20px" }}>
      {isEditing ? (
        <>
          <h2>게시글 수정</h2>
          <form onSubmit={handleUpdate}>
            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={{ width: "400px", padding: "8px" }} />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              style={{
                width: "400px",
                height: "150px",
                padding: "8px",
                marginTop: "10px",
              }}
            />
            <div>
              <button type="submit" style={{ marginTop: "10px", padding: "8px 16px" }}>
                저장
              </button>
              <button type="button" onClick={() => setIsEditing(false)} style={{ marginLeft: "10px", padding: "8px 16px" }}>
                취소
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h2>{board.title}</h2>
          <p>작성자: 익명</p>
          <p>작성일: {new Date(board.createDate).toLocaleDateString()}</p>
          <p>{board.content}</p>

          {files.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h4>📎 첨부파일</h4>
              <ul>
                {files.map((file) => (
                  <li key={file.id}>
                    <a href={downloadFileUrl(file.id)} target="_blank" rel="noopener noreferrer" download>
                      {file.originalFileName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isMyPost && (
            <div style={{ marginTop: "20px" }}>
              <button onClick={() => setIsEditing(true)} style={{ padding: "8px 16px", marginRight: "10px" }}>
                수정
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: "8px 16px",
                  background: "#f44336",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
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

import { useEffect, useState } from "react";
import axios from "axios";
import { getUserId } from "../../utils/userUtils";

function CommentList({ boardId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const myUserId = getUserId();

  // 댓글 목록 불러오기
  const loadComments = () => {
    axios
      .get(`/api/comments?boardId=${boardId}`)
      .then((res) => setComments(res.data))
      .catch((err) => console.error("댓글 불러오기 실패:", err));
  };

  useEffect(() => {
    loadComments();
  }, [boardId]);

  // 댓글 등록
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    axios
      .post("/api/comments", {
        boardId,
        userId: myUserId,
        content: newComment,
      })
      .then(() => {
        setNewComment("");
        loadComments();
      })
      .catch((err) => {
        console.error("댓글 등록 실패:", err);
        alert("댓글 등록 중 오류 발생");
      });
  };

  // 댓글 수정
  const handleUpdate = (id) => {
    if (!editingContent.trim()) return;

    axios
      .put(`/api/comments/${id}`, { content: editingContent })
      .then(() => {
        setEditingId(null);
        setEditingContent("");
        loadComments();
      })
      .catch((err) => {
        console.error("댓글 수정 실패:", err);
        alert("수정 중 오류 발생");
      });
  };

  // 댓글 삭제
  const handleDelete = (id) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    axios
      .delete(`/api/comments/${id}`)
      .then(() => loadComments())
      .catch((err) => {
        console.error("댓글 삭제 실패:", err);
        alert("삭제 중 오류 발생");
      });
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h4>댓글</h4>

      {/* 댓글 입력창 */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: "8px" }}
          placeholder="댓글을 입력하세요"
        />
        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "6px 12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          등록
        </button>
      </form>

      {/* 댓글 목록 */}
      <ul style={{ marginTop: "20px", listStyle: "none", padding: 0 }}>
        {comments.map((c) => (
          <li
            key={c.id}
            style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}
          >
            <div style={{ fontSize: "14px", color: "#888" }}>
              <strong>익명</strong> | {new Date(c.createDate).toLocaleString()}
            </div>

            {editingId === c.id ? (
              <>
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  rows={2}
                  style={{ width: "100%", marginTop: "6px", padding: "6px" }}
                />
                <button onClick={() => handleUpdate(c.id)}>저장</button>
                <button
                  onClick={() => setEditingId(null)}
                  style={{ marginLeft: "6px" }}
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <p style={{ marginTop: "6px" }}>{c.content}</p>
                {c.userId === myUserId && (
                  <div>
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setEditingContent(c.content);
                      }}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      style={{ marginLeft: "6px", color: "red" }}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommentList;

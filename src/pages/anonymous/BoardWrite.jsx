import { useState } from "react";
import axios from "axios";
import { getUserId } from "../../utils/userUtils";
import { uploadFiles } from "../../api/fileApi"; // 📁 파일 업로드 API 호출

function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const newBoard = {
      userId: getUserId(),
      title,
      content,
    };

    // 1️⃣ 게시글 먼저 등록
    axios
      .post("/api/board", newBoard)
      .then((res) => {
        const boardId = res.data.id; // 백엔드에서 반환하는 게시글 ID 필요
        alert("게시글이 등록되었습니다.");

        // 2️⃣ 파일이 있다면 업로드
        if (files.length > 0) {
          uploadFiles(files, boardId)
            .then(() => {
              alert("첨부파일 업로드 완료");
              resetForm(); // 파일 포함 전체 초기화
            })
            .catch((err) => {
              console.error("파일 업로드 실패:", err);
              alert("파일 업로드 중 오류 발생");
            });
        } else {
          resetForm();
        }
      })
      .catch((err) => {
        console.error("작성 실패:", err);
        alert("게시글 등록 중 오류가 발생했습니다.");
      });
  };

  // 입력 및 파일 초기화 함수
  const resetForm = () => {
    setTitle("");
    setContent("");
    setFiles([]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "400px", padding: "8px" }}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <textarea
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: "400px", height: "150px", padding: "8px" }}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>

        <button
          type="submit"
          style={{ marginTop: "10px", padding: "8px 16px" }}
        >
          등록
        </button>
      </form>
    </div>
  );
}

export default BoardWrite;

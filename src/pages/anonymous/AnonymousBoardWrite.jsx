import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserId } from "../../utils/userUtils";
import { uploadFiles } from "../../api/anonymousFileApi";
import axios from "axios";

function AnonymousBoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/board", {
        userId: getUserId(),
        title,
        content,
      });

      const boardId = res.data.id;
      if (files.length > 0) {
        await uploadFiles(files, boardId);
      }

      alert("게시글이 등록되었습니다.");
      navigate("/anonymous");
    } catch (err) {
      console.error(err);
      alert("작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" className="w-full p-2 border rounded" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용" className="w-full h-40 p-2 border rounded" />
      <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        등록
      </button>
    </form>
  );
}

export default AnonymousBoardWrite;

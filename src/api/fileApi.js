import axios from "axios";

/** 📌 여러 파일 업로드 */
export const uploadFiles = (files, boardId) => {
  const formData = new FormData();
  formData.append("boardId", boardId);

  Array.from(files).forEach((file) => {
    formData.append("files", file); // 서버에서 files[]로 받도록 설정
  });

  return axios.post("/api/files/upload-multiple", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/** 📌 게시글 ID로 첨부파일 목록 조회 */
export const fetchFilesByBoardId = (boardId) => {
  return axios.get(`/api/files/${boardId}`);
};

/** 📌 파일 다운로드 링크 반환 */
export const downloadFileUrl = (fileId) => {
  return `/api/files/download/${fileId}`;
};

/** 🗑️ 파일 삭제 */
export const deleteFileById = (fileId) => {
  return axios.delete(`/api/files/${fileId}`);
};

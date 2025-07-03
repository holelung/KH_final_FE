// src/api/boardApi.js
import axios from "axios";

export const fetchAllBoards = () => axios.get("/api/board");

export const fetchMyBoards = (userId) =>
  axios.get(`/api/board/search/my`, {
    params: {
      keyword: "", // 필수 파라미터, 백엔드 요구사항
      userId: userId,
    },
  });

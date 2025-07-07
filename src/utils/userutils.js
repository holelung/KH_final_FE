// src/utils/userUtils.js

/** 현재 로그인한 사용자 ID를 localStorage에서 가져옴 */
export function getUserId() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.id || null;
}

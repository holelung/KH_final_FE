// src/utils/userUtil.js

export function getUserId() {
  let userId = localStorage.getItem("anonymousUserId");

  if (!userId) {
    userId = Date.now() + "_" + Math.floor(Math.random() * 10000);
    localStorage.setItem("anonymousUserId", userId);
  }

  return userId;
}

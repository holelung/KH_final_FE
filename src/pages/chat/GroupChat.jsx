import React, { useEffect, useRef } from "react";

const GroupChat = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("tokens"))?.accessToken;
    if (!token) {
      console.error("❌ 토큰 없음");
      return;
    }

    const socket = new WebSocket(`ws://localhost:8080/ws/chat/room/1?token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("🟢 WebSocket 연결 성공");

      // 🔽 테스트 메시지 전송
      const testMessage = {
        type: "send",
        teamId: 1,
        senderId: 44,
        content: "테스트 메시지입니다!",
      };
      socket.send(JSON.stringify(testMessage));
      console.log("📤 메시지 전송됨:", testMessage);
    };

    socket.onmessage = (event) => {
      console.log("📥 수신된 메시지:", event.data);
    };

    socket.onerror = (error) => {
      console.error("🚫 소켓 에러:", error);
    };

    socket.onclose = () => {
      console.log("❌ 연결 종료");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h2>🧪 WebSocket 테스트 (메시지 송수신)</h2>
    </div>
  );
};

export default GroupChat;

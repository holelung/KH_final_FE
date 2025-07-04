import React, { useEffect, useRef, useState } from "react";

const GroupChat = () => {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const userInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
  const token = JSON.parse(sessionStorage.getItem("tokens"))?.accessToken;

  if (!userInfo || !token) {
    return <div>로그인이 필요합니다.</div>;
  }

  const userNo = parseInt(userInfo.id);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/ws/chat/room/1?token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("🟢 WebSocket 연결 성공");
    };

    socket.onmessage = (event) => {
      const received = JSON.parse(event.data);
      console.log("📥 수신된 메시지:", received);
      setMessages((prev) => [...prev, received]);
    };

    socket.onerror = (error) => {
      console.error("🚫 WebSocket 에러:", error);
    };

    socket.onclose = () => {
      console.log("❌ WebSocket 연결 종료");
    };

    return () => {
      socket.close();
    };
  }, []); 

  const handleSend = (e) => {
    if (!inputText.trim()) return;


    const newMessage = {
      senderId: userNo,
      senderName: userInfo.realname, 
      content: inputText.trim(),
      type: "send"
    };

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log(JSON.stringify(newMessage));
      socketRef.current.send(JSON.stringify(newMessage));
      setInputText("");
    } else {
      console.warn("🚫 WebSocket이 열려있지 않아 메시지를 보낼 수 없습니다.");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">💬 단체 채팅</h2>

      <div className="border rounded-lg p-4 h-80 overflow-y-auto bg-gray-50 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 shadow rounded max-w-[70%] ${
              msg.senderId === userNo ? "ml-auto bg-blue-100 text-right" : "mr-auto bg-white text-left"
            }`}
          >
            <div className="text-sm text-gray-600 font-semibold">
              {msg.senderId === userNo ? "나" : `${msg.senderName ?? msg.senderId}`}
            </div>
            <div>{msg.content}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <input
          className="flex-1 border px-3 py-2 rounded"
          type="text"
          placeholder="메시지를 입력하세요..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && handleSend(e)}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default GroupChat;

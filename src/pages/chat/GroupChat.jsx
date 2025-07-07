import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { apiService } from "../../api/apiService";
import { toast } from "react-toastify";

const GroupChat = () => {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const { teamId } = useParams();

  const userInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
  const token = JSON.parse(sessionStorage.getItem("tokens"))?.accessToken;

  if (!userInfo || !token) {
    return <div>로그인이 필요합니다.</div>;
  }

  const userNo = parseInt(userInfo.id);

  useEffect(() => {

  console.log("✅ useEffect 실행됨");
  console.log("✅ teamId:", teamId);

    const fetchOldMessages = async () => {
      try {
        const res = await apiService.get("/chat", {
          params: { teamId },
        });
        console.log("✅ API 응답:", res);
        if (res.data.code === "S200") {
          setMessages(res.data.data);
          console.log("📚 이전 메시지:", res.data.data);
        } else {
          toast.error(res.data.message || "이전 메시지를 불러올 수 없습니다.");
        }
      } catch (err) {
        console.error("❌ 이전 메시지 로딩 실패:", err);
      }
    };

    fetchOldMessages();

    // 2. WebSocket 연결
    const socket = new WebSocket(`ws://localhost:8080/ws/chat/room/${teamId}?token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => console.log("🟢 WebSocket 연결 성공");
    socket.onmessage = (event) => {
      const received = JSON.parse(event.data);
      setMessages((prev) => [...prev, received]);
    };
    socket.onerror = (error) => console.error("🚫 WebSocket 에러:", error);
    socket.onclose = () => console.log("❌ WebSocket 종료");

    return () => socket.close();
  }, [teamId, token]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      teamId: parseInt(teamId),
      senderId: userNo,
      senderName: userInfo.realname,
      content: inputText.trim(),
      type: "send",
    };

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(newMessage));
      setInputText("");
    } else {
      toast.error("WebSocket이 열려있지 않습니다.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">💬 단체 채팅방 #{teamId}</h2>

<div className="border rounded-lg p-4 h-96 overflow-y-auto bg-gray-50 mb-4 flex flex-col gap-2">
  {messages.map((msg, idx) => {
    const isMine = msg.senderId === userNo;
    return (
      <div
        key={idx}
        className={`flex ${isMine ? "justify-end" : "justify-start"} relative`}
      >
        <div
          className={`max-w-[70%] px-4 py-2 rounded-2xl shadow
            ${isMine ? "bg-blue-200 text-right text-gray-800 rounded-br-none" : "bg-white text-left text-gray-800 rounded-bl-none"}
            relative
          `}
          style={{
            marginRight: isMine ? '4px' : 0,
            marginLeft: isMine ? 0 : '4px',
            position: 'relative',
          }}
        >
          {/* 말풍선 꼬리 */}
          <span
            style={{
              position: 'absolute',
              top: 18,
              right: isMine ? -10 : undefined,
              left: isMine ? undefined : -10,
              width: 0,
              height: 0,
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderLeft: isMine ? undefined : '10px solid #fff',
              borderRight: isMine ? '10px solid #bfdbfe' : undefined, // #bfdbfe: Tailwind blue-200
            }}
          />
          <div className="text-xs text-gray-500 font-semibold mb-1">
            {isMine ? "나" : msg.senderName || msg.senderId}
          </div>
          <div className="break-words">{msg.content}</div>
        </div>
      </div>
    );
  })}
</div>


      <div className="flex items-center space-x-2">
        <input
          className="flex-1 border px-3 py-2 rounded"
          type="text"
          placeholder="메시지를 입력하세요..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">
          전송
        </button>
      </div>
    </div>
  );
};

export default GroupChat;

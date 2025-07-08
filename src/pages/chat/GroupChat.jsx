import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { apiService } from "../../api/apiService";
import { toast } from "react-toastify";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

const GroupChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isFirstRender = useRef(true);

  const { teamId } = useParams();
  const location = useLocation();
  const teamName = location.state?.teamName || "";
  const userInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
  const token = JSON.parse(sessionStorage.getItem("tokens"))?.accessToken;
  const userNo = parseInt(userInfo?.id);

  if (!userInfo || !token) {
    return <div>로그인이 필요합니다.</div>;
  }

  useEffect(() => {
    apiService.get("/chat", { params: { teamId } })
      .then((res) => {
        if (res.data.code === "S200") setMessages(res.data.data);
        else toast.error(res.data.message || "이전 메시지를 불러올 수 없습니다.");
      })
      .catch(() => toast.error("이전 메시지 로딩 실패"));

    const socket = new WebSocket(`ws://localhost:8080/ws/chat/room/${teamId}?token=${token}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const received = JSON.parse(event.data);
        setMessages((prev) => [...prev, received]);
      } catch (e) {
        console.error("메시지 파싱 오류:", e);
      }
    };

    return () => socket.close();
  }, [teamId, token]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: isFirstRender.current ? "auto" : "smooth",
      });
      isFirstRender.current = false;
    }
  }, [messages]);

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

  const renderMessage = (msg, idx) => {
    const isMine = String(msg.senderId) === String(userNo);
    return (
      <div
        key={idx}
        className={`flex ${isMine ? "justify-end" : "justify-start"} relative`}
      >
        <div
          className={`max-w-[75%] px-7 py-4 rounded-2xl shadow
            ${isMine
              ? "bg-blue-200 text-right text-gray-800 rounded-br-none"
              : "bg-white text-left text-gray-800 rounded-bl-none"}
            relative`}
          style={{
            marginRight: isMine ? 8 : 0,
            marginLeft: isMine ? 0 : 8,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 28,
              right: isMine ? -12 : undefined,
              left: isMine ? undefined : -12,
              width: 0,
              height: 0,
              borderTop: "12px solid transparent",
              borderBottom: "12px solid transparent",
              borderLeft: isMine ? undefined : "12px solid #fff",
              borderRight: isMine ? "12px solid #bfdbfe" : undefined,
            }}
          />
          <div className="text-sm text-gray-500 font-semibold mb-1">
            {msg.senderName || msg.senderId}
          </div>
          <div className="break-words font-bold">{msg.content}</div>
          <div className={`flex items-center gap-2 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
            <span className="text-xs text-gray-400">
              {msg.sentDate &&
                new Date(msg.sentDate).toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto h-[80vh] flex flex-col">
      {/* 채팅방 헤더 */}
      <div className="flex items-center gap-2 px-10 py-6 bg-white border-b-2 border-gray-200 rounded-t-2xl shadow">
        <HiOutlineChatBubbleLeftRight className="text-blue-500 text-3xl" />
        <h2 className="text-2xl font-bold">{teamName}</h2>
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="flex-1 bg-gray-50 px-12 py-8 rounded-b-2xl shadow overflow-y-auto flex flex-col gap-6">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
            아직 메시지가 없습니다. 인사를 남겨보세요!
          </div>
        ) : (
          <>
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 입력창 영역 */}
      <div className="flex items-center gap-4 px-10 py-5 bg-white border-t-2 border-gray-200 rounded-b-2xl shadow mt-2">
        <input
          className="flex-1 border border-gray-300 px-5 py-3 rounded-lg focus:outline-none focus:border-blue-400 text-base"
          type="text"
          placeholder="메시지를 입력하세요..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyUp={e => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-7 py-3 rounded-lg transition text-base"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default GroupChat;

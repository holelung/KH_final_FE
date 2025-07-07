import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../api/apiService";
import { toast } from "react-toastify";

const ChatRoomList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const res = await apiService.get("/chat/rooms");
        if (res.data.code === "S200") {
          setChatRooms(res.data.data);
        } else {
          toast.error(res.data.message || "채팅방 목록을 불러올 수 없습니다.");
        }
      } catch (err) {
        console.error("❌ 채팅방 목록 조회 실패:", err);
        toast.error("채팅방 목록 조회 중 오류가 발생했습니다.");
      }
    };

    fetchChatRooms();
  }, []);

  const handleEnterRoom = (teamId) => {
    navigate(`/chat/${teamId}`);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">💬 채팅방 목록</h2>
      {chatRooms.length === 0 ? (
        <p className="text-gray-500">채팅방이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {chatRooms.map((room) => (
            <li
              key={room.id}
              onClick={() => handleEnterRoom(room.id)}
              className="p-4 border rounded cursor-pointer hover:bg-gray-100"
            >
              {room.teamName} (#{room.id})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatRoomList;

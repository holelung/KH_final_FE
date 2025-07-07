import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../api/apiService";
import { toast } from "react-toastify";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

const ChatRoomList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatRooms = () => {
      apiService.get("/chat/rooms")
        .then(res => {
          if (res.data.code === "S200") {
            setChatRooms(res.data.data);
          } else {
            toast.error(res.data.message || "채팅방 목록을 불러올 수 없습니다.");
          }
        })
        .catch(err => {
          console.error("❌ 채팅방 목록 조회 실패:", err);
          toast.error("채팅방 목록 조회 중 오류가 발생했습니다.");
        });
    };
    fetchChatRooms();
  }, []);

  const handleEnterRoom = (teamId, teamName) => {
    navigate(`/chat/${teamId}`, { state: { teamName } });
  };

  return (
    <div className="p-10 max-w-xl mx-auto flex flex-col items-center relative text-lg">
      {/* 흐릿한 배경 아이콘 */}
      <HiOutlineChatBubbleLeftRight 
        className=" absolute text-blue-100 text-[120px] opacity-20 left-1/2 -translate-x-1/2 top-16 pointer-events-none text-xl" 
        aria-hidden
      />

      <div className="relative z-10 w-full">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2 flex items-center gap-2 justify-center">
          <HiOutlineChatBubbleLeftRight className="text-blue-400 text-3xl" />
          채팅방 목록
        </h2>
        <div className="text-xl text-gray-500  text-center mb-8">
          채팅방을 선택해 바로 대화를 시작하세요.
        </div>
        {chatRooms.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">채팅방이 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-6">
            {chatRooms.map((room) => (
              <li
                key={room.id}
                onClick={() => handleEnterRoom(room.id, room.teamName)}
                className="
                  bg-white hover:bg-blue-50 transition
                  border border-gray-200 shadow
                  rounded-xl px-6 py-5
                  flex items-center gap-4 cursor-pointer
                  group
                "
                tabIndex={0}
                onKeyDown={e => (e.key === "Enter" || e.key === " ") && handleEnterRoom(room.id, room.teamName)}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-500 text-2xl group-hover:bg-blue-200">
                  <HiOutlineChatBubbleLeftRight />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800 text-xl group-hover:text-blue-600">
                    {room.teamName}
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                      #{room.id}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {room.description || "채팅방에 참여해보세요!"}
                  </div>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleEnterRoom(room.id, room.teamName);
                  }}
                  className="ml-3 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-full shadow-sm transition"
                >
                  입장
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatRoomList;

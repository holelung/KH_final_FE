import { toast } from "react-toastify";
import { apiService } from "../../api/apiService";



const UserUpdateModal = ({ open, onClose, user, approve }) => {

  const handleApprove = () => {
    if(!confirm("승인처리 하시겠습니까?")) return;

    apiService.post("/auth/approve",{
      id:user.id,
    }).then(response => {
      if(response.data.success){
        toast.success("승인되었습니다.");
        approve();
      }
    })
  }
  
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-8 min-w-[320px]">
        <h2 className="text-2xl font-bold mb-4">회원 상세정보</h2>
        <div className="space-y-2">
          <div><b>사번:</b> {user.username}</div>
          <div><b>이름:</b> {user.realname}</div>
          <div><b>이메일:</b> {user.email}</div>
          <div><b>전화번호:</b> {user.phone}</div>
          <div><b>주소:</b> {user.address1}</div>
          <div><b>상세주소:</b> {user.address2}</div>
          <div><b>주민번호:</b> {user.ssn}</div>
          <div><b>가입날짜:</b> {user.enrollDate?.replace("T", " ")}</div>
          <div><b>승인여부:</b> {user.isActive === 'Y'? "승인" : "미승인"}</div>
        </div>
        <div className="flex justify-between mt-6">
          <button className="px-4 py-2 bg-saintragreen text-white rounded" onClick={()=> handleApprove()}>승인</button>
          <button className="px-4 py-2 bg-saintradarkblue text-white rounded" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default UserUpdateModal;
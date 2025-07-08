import { toast } from "react-toastify";
import { apiService } from "../../api/apiService";
import { useContext, useEffect, useState } from "react";



const UserUpdateModal = ({ open, onClose, user, approve, auth }) => {
  const [dept, setDept] = useState([]);
  const [team, setTeam] = useState([]);
  const [job, setJob] = useState([]);
  const [request, setRequest] = useState({
    deptId:'',
    teamId:'',
    jobId:'',
  }) 

  useEffect(() => {
    apiService.get("/users/company")
      .then(response => {
        console.log(response);
        if(response.data.success){
          setDept([...response.data.data.dept]);
          setTeam([...response.data.data.team]);
          setJob([...response.data.data.job]);
        }
      })
  },[open])

  const handleUpdate = () => {
    if(!confirm("정보를 변경하시겠습니까?")) return;

    apiService.put("/users/admin",{
      id:user.id,
      role: auth.loginInfo.role,
      deptId:request.deptId,
      teamId:request.teamId,
      jobId: request.jobId,
    }).then(response => {
      if(response.data.success){
        toast.success("처리되었습니다.");
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
          <div className="flex items-center gap-2">
            <div><b>부서:</b> {user.deptName}</div>
            <select 
              name="deptId" 
              id="deptId" 
              className="px-2 py-1 border rounded" 
              value={request.deptId}
              onChange={(e)=>setRequest(prev => ({
                ...prev,
                deptId:e.target.value
              }))}
            >
              {dept.map(item=>(
                <option value={item.id}>{item.deptName}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div><b>팀:</b> {user.teamName}</div>
            <select 
              name="teamId" 
              id="teamId" 
              className="px-2 py-1 border rounded" 
              value={request.teamId}
              onChange={(e) => setRequest(prev => ({
                ...prev,
                teamId:e.target.value
              }))}
            >
              {team.filter(team => team.deptId == 
                request.deptId).length === 0 ?
                  (<option disabled>팀이 없습니다.</option>) : 
                  team.filter(team => team.deptId == request.deptId).map(item=>(
                <option value={item.id}>{item.teamName}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div><b>직급:</b> {user.jobName}</div>
            <select 
              name="jobId" 
              id="jobId" 
              className="px-2 py-1 border rounded" 
              value={request.jobId}
              onChange={(e)=>setRequest(prev => ({
                ...prev,
                jobId:e.target.value
              }))}
            >
              {job.map(item=>(
                <option value={item.id}>{item.jobName}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button className="px-4 py-2 bg-saintragreen text-white rounded" onClick={()=> handleUpdate()}>변경</button>
          <button className="px-4 py-2 bg-saintradarkblue text-white rounded" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default UserUpdateModal;
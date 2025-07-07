import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Components/pagination/Pagination";
import { apiService } from "../../api/apiService";
import UserDetailModal from "./UserDetailModal";

const ApproveJoin = () => {
  const navi = useNavigate();
  const [data, setData] = useState([]);
  const [request, setRequest] = useState({
    rowsPerPage:'10',
    search: null,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [approve, setApprove] = useState(false);

  useEffect(()=>{
    apiService.get('/auth/approve',{
      params: {
        rowsPerPage: request.rowsPerPage,
        search: request.search,
        currentPage: currentPage,
      }
    }).then(response => {
      if(response.data.success) {
        setData([...response.data.data.list]);
        setTotalPage(Math.ceil(response.data.data.total / request.rowsPerPage));
      }
    })

  },[currentPage, request])


  const handleSearch = () => {
    setRequest(prev => ({
      ...prev,
      search:searchText,
    }));
  }

  const format = (date) => {
    return date.toISOString().slice(0,10);
  }

  const handleDetailOpen = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDetailClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleApprove = () => {
    setApprove(!approve);
    setModalOpen(false);
  }

  return (
    <>
      <div className="flex flex-col justify-start max-w-full mx-3 h-full font-PretendardM text-lg">
        <h1 className="text-5xl font-PretendardB text-left my-3">회원가입 승인</h1>
        <div className="flex flex-col items-center justify-between md:flex-row gap-8 my-2">
          <div className="flex items-center gap-2">
            <input 
              id ="search"
              type="text"
              placeholder="아이디"
              className="px-2 py-1 border rounded"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <button
              className="px-3 py-1.5 rounded bg-saintragreen"
              onClick={()=> handleSearch()}
            >
              검색
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor={request.rowsPerPage}>개수</label>
            <select 
              name="rowsPerPage" 
              id="rowsPerPage"
              className="border px-2 py-1 rounded"
              value={request.rowsPerPage}
              onChange={e => setRequest(prev => ({
                ...prev,
                rowsPerPage: e.target.value
              }))}
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
        <section className="bg-saintralightblue rounded-xl py-2">
          <table className="table-fixed w-full border-separate border-spacing-4">
            <thead className="font-PyeojinGothicB text-lg">
              <tr>
                <th className="w-1/8">번호</th>
                <th className="w-1/8">사번</th>
                <th className="w-1/8">이름</th>
                <th className="w-3/8">이메일</th>
                <th className="w-2/8">전화번호</th>
                <th className="w-2/8">가입 날짜</th>
              </tr>
              <tr>
                <td colSpan={3}>
                  <hr className="border-t border-gray-300 my-1"/>
                </td>
              </tr>
            </thead>
            <tbody className="font-PretendardM text-center">
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id} onClick={() => handleDetailOpen(item)}>
                    <td>{item.id}</td>
                    <td>{item.username}</td>
                    <td>{item.realname}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td>{item.issueDate.replace("T", " ")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>가입 대기 목록이 없습니다</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPage}
            onPageChange={setCurrentPage}
          />
      </div>
      <UserDetailModal 
        open={modalOpen}
        onClose={handleDetailClose}
        user={selectedUser}
        approve={handleApprove}
      />
    </>
  )
}

export default ApproveJoin;
import { useEffect, useState } from "react";
import DateRequest from "../../Components/request/DateRequest";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../api/apiService";
import Pagination from "../../Components/pagination/Pagination";



const Log = () => {
  const navi = useNavigate();
  const [data, setData] = useState([]);
  const [logRequest, setLogRequest] = useState({
    startDate:'',
    endDate:'',
    rowsPerPage:'10',
    search: null,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState("")
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    const today = new Date();
    const prevMonth = new Date();
    today.setDate(today.getDate()+1);
    prevMonth.setMonth(today.getMonth() - 1);

  
    setLogRequest(prev => ({
      ...prev,
      startDate: format(prevMonth),
      endDate: format(today),
    }))
  },[]);

  useEffect(() => {
    if(!logRequest.startDate || !logRequest.endDate) return;

    apiService.get("/logs", {
      params:{
        startDate:logRequest.startDate,       
        endDate:logRequest.endDate,       
        currentPage: currentPage,       
        rowsPerPage:logRequest.rowsPerPage,       
        search:logRequest.search,       
      }
    })
      .then(response => {
        console.log(response.data);
        setData([...response.data.data.list]);
        setTotalPage(Math.ceil(response.data.data.total / logRequest.rowsPerPage));
      })

  }, [logRequest, currentPage])

  const handleSearch = () => {
    setLogRequest(prev => ({
      ...prev,
      search:searchText,
    }));
  }

  const format = (date) => {
    return date.toISOString().slice(0,10);
  }

  return (
    <>
      <div className="flex flex-col justify-start max-w-full mx-3 h-full font-PretendardM text-lg">
        <h1 className="text-5xl font-PretendardB text-left my-3">로그조회</h1>
        <div className="flex flex-col items-center justify-evenly  md:flex-row gap-8">
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
          <DateRequest
            dateSelect={logRequest}
            setDateSelect={setLogRequest}
          />
          <div className="flex gap-2 items-center">
            <label htmlFor={logRequest.rowsPerPage}>개수</label>
            <select 
              name="rowsPerPage" 
              id="rowsPerPage"
              className="border px-2 py-1 rounded"
              value={logRequest.rowsPerPage}
              onChange={e => setLogRequest(prev => ({
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
                <th className="w-1/10">번호</th>
                <th className="w-2/10">이용자</th>
                <th className="w-4/10">이용서비스</th>
                <th className="w-1/10">타입</th>
                <th className="w-1/10">결과</th>
                <th className="w-2/10">시간</th>
                <th className="w-2/10">IP</th>
                <th className="w-2/10">Referer</th>
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
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.realname}</td>
                    <td>{item.actionArea.replace("http://localhost:8080", "")}</td>
                    <td>{item.actionType}</td>
                    <td>{item.actionResult}</td>
                    <td>{item.actionTime.replace("T", " ")}</td>
                    <td>{item.clientIp}</td>
                    <td>{item.referer ? item.referer.replace("http://", ""): "null"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>게시물이 없습니다</td>
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
    </>
  );
}

export default Log;
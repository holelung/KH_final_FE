import { useNavigate } from "react-router-dom";
import DateRequest from "../../Components/request/DateRequest";
import { useEffect, useState } from "react";
import { apiService } from "../../api/apiService";

const UserAttendance = () => {
  const navi = useNavigate();
  const [dateSelect, setDateSelect] = useState({
    startDate:"",
    endDate:"",
  });
  const [data, setData] = useState([]);


  useEffect(() => {
    const today = new Date();
    const prevMonth = new Date();
    today.setDate(today.getDate()+1);
    prevMonth.setMonth(today.getMonth() - 1);

  
    setDateSelect({
      startDate: format(prevMonth),
      endDate: format(today),
    })
  },[]);

  useEffect(() => {
    apiService.get('/users/attendance',{
      params:dateSelect,
    })
      .then(response => {
        if(response.data.success){
          setData([...response.data.data]);
        }
      })

  },[dateSelect])

  const format = (date) => {
    return date.toISOString().slice(0,10);
  }
  

  return (
    <>
      <div className="flex flex-col items-center">
        <h2 className="font-PretendardB text-2xl">Attendance View</h2>
        <DateRequest 
          dateSelect={dateSelect}
          setDateSelect={setDateSelect}
        />

        <section className="bg-saintralightblue rounded-xl py-2">
          <table className="table-fixed w-full border-separate border-spacing-4">
            <thead className="font-PyeojinGothicB text-lg">
              <tr>
                <th className="w-1/8">번호</th>
                <th className="w-4/8">출/퇴근</th>
                <th className="w-2/8">시간</th>
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
                    <td>{item.type}</td>
                    <td>
                      {item.time.replace("T", " ")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>게시물이 없습니다</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="my-12 text-lg text-gray-500 cursor-pointer hover:text-saintradarkblue active:scale-95 select-none">
          <div onClick={() => navi("/mypage")}>&lt; Go Back</div>
        </section>
      </div>
    </>
  );
}

export default UserAttendance;
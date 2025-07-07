import { useEffect, useState } from "react";
import { apiService } from "../../api/apiService";
import { useNavigate } from "react-router-dom";

const DepartmentList = () => {
  const [deptList, setDeptList] = useState([]);
  const [deptInput, setDeptInput] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [personnel, setPersonnel] = useState("N");
  const [inspect, setInspect] = useState("N");
  const [enabling, isEnabling] = useState(false);

  const navi = useNavigate();

  useEffect(() => {
    apiService
      .get(`/departments`)
      .then((res) => {
        console.log(res);
        setDeptList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [deptInput, enabling]);

  const handleDepartmentInput = () => {
    setDeptInput(!deptInput);
  };

  const handleDepartmentName = (e) => {
    setDepartmentName(e.target.value);
  };

  const handleDepartmentSubmit = () => {
    if (!departmentName) {
      return;
    }
    apiService
      .post(`/departments`, { departmentName: departmentName, personnel: personnel, inspect: inspect })
      .then((res) => {
        console.log(res);
        setDeptInput(!deptInput);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEnableDepartment = (value, e) => {
    console.log(value);
    const deptId = value;
    apiService
      .patch(`/departments/${deptId}`)
      .then((res) => {
        console.log(res);
        isEnabling(!enabling);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {deptInput ? (
        <div>
          <div
            onClick={handleDepartmentInput}
            className="fixed top-0 left-0 w-screen h-screen z-200 bg-black opacity-50 flex justify-center items-center"
          ></div>
          <div className="fixed top-1/2 left-1/2 -translate-1/2 w-2xl h-auto p-8 z-300 bg-white rounded-xl opacity-100">
            <div className="flex flex-col gap-4">
              <section>
                <div className="font-PyeojinGothicB text-3xl">부서 생성 요청</div>
              </section>
              <section className="flex flex-col gap-1">
                <label htmlFor="deptname" className="ml-1 text-xl">
                  부서 이름
                </label>
                <input
                  id="deptname"
                  value={departmentName}
                  onChange={handleDepartmentName}
                  type="text"
                  placeholder="부서명을 입력 하세요."
                  className="px-2 py-1 text-lg border-2 border-saintragray rounded-md"
                />
              </section>
              <section className="flex justify-end">
                <button onClick={handleDepartmentSubmit} className="px-2 py-1 mr-1 bg-saintragreen text-white rounded-sm cursor-pointer">
                  요청
                </button>
              </section>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="w-full min-h-full flex flex-col justify-start gap-2">
        <section className="flex justify-between items-center">
          <div className="ml-1 text-3xl font-PyeojinGothicB">부서 목록</div>
          <div>
            <button onClick={handleDepartmentInput} type="button" className="mr-1 px-2 py-1 text-lg bg-saintragreen rounded-md text-white cursor-pointer">
              부서 생성 요청
            </button>
          </div>
        </section>
        <section className="flex flex-col justify-between gap-2">
          <section className="bg-saintralightblue rounded-md">
            <table className="table-fixed w-full border-separate border-spacing-4">
              <thead className="font-PyeojinGothicB text-lg">
                <tr>
                  <th className="w-4/8">부서명</th>
                  <th className="w-2/8">책임자</th>
                  <th className="w-2/8">활성화</th>
                </tr>
              </thead>
              <tbody className="font-PretendardM text-center text-saintrablack">
                {deptList.map((dept) => (
                  <tr key={dept.id}>
                    {dept.isActive === "N" ? (
                      <td className="w-4/8 py-2 bg-white rounded-md">{dept.deptName}</td>
                    ) : (
                      <td
                        onClick={() => {
                          navi(`/department/${dept.id}`);
                        }}
                        className="w-4/8 py-2 bg-white rounded-md cursor-pointer"
                      >
                        {dept.deptName}
                      </td>
                    )}
                    <td className="w-2/8 py-2 bg-white rounded-md">
                      {dept.realname}({dept.username})
                    </td>
                    <td className="w-1/8 py-2 bg-white rounded-md">
                      {dept.isActive}
                      {dept.isActive === "N" ? (
                        <button
                          onClick={(e) => handleEnableDepartment(dept.id, e)}
                          type="button"
                          className="ml-2 px-2 py-1 rounded-sm bg-saintragreen text-sm text-white cursor-pointer"
                        >
                          전환
                        </button>
                      ) : (
                        <></>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </section>
      </div>
    </>
  );
};

export default DepartmentList;

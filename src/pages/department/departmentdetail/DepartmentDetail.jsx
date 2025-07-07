import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiService } from "../../../api/apiService";

const DepartmentDetail = () => {
  const params = useParams();

  const navi = useNavigate();

  useEffect(() => {
    if (!params.id) {
      alert("잘못된 접근 입니다.");
      navi("/");
      return;
    }

    apiService
      .get(`http://localhost:8080/api/departments/${params.id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div className="w-full min-h-full flex flex-col justify-start gap-2">
        <section className="font-PyeojinGothicB text-3xl">부서명 페이지</section>
      </div>
    </>
  );
};

export default DepartmentDetail;

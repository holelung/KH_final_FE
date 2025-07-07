import { useContext, useEffect } from "react";
import { apiService } from "../../../api/apiService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";

const Header = () => {
  const {logout} = useContext(AuthContext);
  const navi = useNavigate();

  // useEffect(() => {
  //   apiService
  //     .get(`http://localhost:8080/api/files/users`)
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  return (
    <>
      <div className="absolute top-0 w-full h-12 z-5 bg-saintralightblue shadow-md font-PretendardM flex justify-center items-center box-border">
        <div className="w-5xl h-full flex justify-end items-center gap-4">
          <div className="size-full flex justify-end">
            <div
              onClick={() => {
                navi("/mypage");
              }}
              className="mr-2 flex justify-center items-center"
            >
              내 정보(사진)
            </div>
            <div
              onClick={() => logout()}
              className="mx-2 flex justify-center items-center"
            >
              로그아웃
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

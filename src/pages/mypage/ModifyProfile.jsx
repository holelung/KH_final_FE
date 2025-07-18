import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../api/apiService";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { toast } from "react-toastify";
import parse from "html-react-parser";

const ModifyProfile = () => {
  const navi = useNavigate();
  const open = useDaumPostcodePopup("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");
  const [userInfo, setUserInfo] = useState({
    realname: "",
    phone: "",
    address1: "",
    address2: "",
  });
  const [profile, setProfile] = useState({});
  const [profileUrlImgTag, setProfileImgTag] = useState("");
  const [profileUpdate, setProfileUpdate] = useState(true);

  useEffect(() => {
    apiService.get("/users/me").then((response) => {
      if (response.data.code === "S200") {
        setUserInfo({
          realname: response.data.data.realname,
          phone: response.data.data.phone,
          address1: response.data.data.address1,
          address2: response.data.data.address2,
        });
      }
    });
  }, []);

  useEffect(() => {
    apiService
      .get(`/files/users`)
      .then((res) => {
        setProfile(res.data.data);
        setProfileImgTag(`<img src="${res.data.data.url}" alt="${res.data.data.origin}" className="size-64 rounded-full" />`);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [profileUpdate]);

  const updateHandler = () => {
    for (const [key, value] of Object.entries(userInfo)) {
      if (value == null || value.trim() === "") {
        toast.error("빈칸은 존재할 수 없습니다.");
        return;
      }
    }

    apiService
      .put("/users/mypage", userInfo)
      .then((response) => {
        if (response.data.code === "S202") {
          toast.success(response.data.message);
          navi("/mypage");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // 주소 검색 클릭
  const handleAddressSearchClick = () => {
    open({ onComplete: handleAddressSearchComplete });
  };

  // 주소 검색 완료 핸들러
  const handleAddressSearchComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    setUserInfo((prev) => ({
      ...prev,
      address1: fullAddress,
    }));

    console.log(fullAddress);
  };

  const handlePhoneChange = (e) => {
    let input = e;

    if (input.length === 3 || input.length === 8) {
      input += "-";
    }
    setUserInfo((prev) => ({
      ...prev,
      phone: input,
    }));
  };

  const unregister = () => {
    // 회원 탈퇴
    if (!window.confirm("정말로 탈퇴하시겠습니까?")) return;

    apiService
      .delete("/mypage")
      .then((response) => {
        if (response.data.success) {
          toast.success("회원 탈퇴가 완료되었습니다.");
          navi("/");
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.error(error);
      });
  };

  const handleProfileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      apiService
        .post(`/files/users`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          setProfileUpdate(!profileUpdate);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleProfileRemove = () => {
    if (profile.filename === "ZGU5MDgxMWMtZTgxNy00Njc2LTk2ZjQtYjIzYzUyOTQyYzM5.png") {
      return;
    }
    apiService
      .delete(`/files/users`)
      .then((res) => {
        console.log(res);
        setProfileUpdate(!profileUpdate);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <section className="mb-12 flex flex-col items-center gap-2">
          <div className="mb-8">{parse(profileUrlImgTag)}</div>
          <label htmlFor="profile" className="w-36 px-2 py-1 text-lg text-white text-center bg-saintragreen rounded-md">
            프로필 사진 변경
          </label>
          <input id="profile" onChange={handleProfileChange} type="file" accept="image/*" className="hidden" />
          <button onClick={handleProfileRemove} type="button" className="w-36 px-2 py-1 text-lg text-white text-center bg-red-300 rounded-md">
            제거
          </button>
        </section>
        <h2 className="font-PretendardB text-3xl">내 정보 수정</h2>
        <section className="size-full mt-12 font-PyeojinGothicB flex flex-col gap-6">
          <div className="px-24">
            <input
              id="realname"
              type="text"
              placeholder="이름"
              className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg"
              onChange={(e) =>
                setUserInfo((prev) => ({
                  ...prev,
                  realname: e.target.value,
                }))
              }
              value={userInfo.realname}
            />
          </div>

          {/* 전화번호 */}
          <div className="px-24">
            <input
              id="phone"
              type="text"
              placeholder="전화번호"
              className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg"
              onChange={(e) => handlePhoneChange(e.target.value)}
              value={userInfo.phone}
              maxLength={13}
            />
          </div>

          {/* 주소 입력 */}
          <div className="px-24 flex flex-col gap-4">
            <div className="flex gap-2">
              <input
                id="address1"
                type="text"
                placeholder="주소"
                className="w-4/5 h-full p-4 text-xl border-2 border-gray-400 rounded-lg"
                defaultValue={userInfo.address1}
              />
              <button type="button" className="w-1/5 h-full p-4 text-xl text-white bg-saintragreen rounded-lg" onClick={() => handleAddressSearchClick()}>
                Search
              </button>
            </div>
            <div className="">
              <input
                id="address2"
                type="text"
                placeholder="상세 주소"
                className="size-full px-4 py-2 text-xl border-2 border-gray-400 rounded-lg"
                onChange={(e) =>
                  setUserInfo((prev) => ({
                    ...prev,
                    address2: e.target.value,
                  }))
                }
                value={userInfo.address2}
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3 mt-12">
          <button
            className="w-48 h-20 text-3xl text-white bg-saintragreen rounded-xl cursor-pointer hover:opacity-90 active:scale-95"
            onClick={() => updateHandler()}
          >
            Update
          </button>
          <button className="w-48 h-20 text-3xl text-white bg-red-300 rounded-xl cursor-pointer hover:opacity-90 active:scale-95" onClick={() => unregister()}>
            회원 탈퇴
          </button>
        </section>
        <section className="my-12 text-lg text-gray-500 cursor-pointer hover:text-saintradarkblue active:scale-95 select-none">
          <div onClick={() => navi("/mypage")}>&lt; Go Back</div>
        </section>
      </div>
    </>
  );
};

export default ModifyProfile;

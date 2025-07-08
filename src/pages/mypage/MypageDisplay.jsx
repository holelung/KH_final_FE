import { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { UserIcon, LockClosedIcon, PhotoIcon, UserMinusIcon } from "@heroicons/react/24/outline";

const MypageDisplay = () => {
  const navi = useNavigate();

  return (
    <>
      <div className="flex flex-col justify-start max-w-5xl mx-auto h-full font-PretendardM text-lg">
        {/* 타이틀 */}
        <h1 className="text-5xl font-PretendardB text-center my-15">My Page</h1>
        <Outlet />
      </div>
    </>
  );
};

export default MypageDisplay;

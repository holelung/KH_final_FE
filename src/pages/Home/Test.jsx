import { useState, uesEffect } from 'react';
import { apiService } from '../../api/apiService';


const Test = () => {


  const getRequest = () => {
    apiService
      .get()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error("에러 발생", err);
      });
  };

  const makeError = () => {
    apiService.get("error").then((res) => {
      console.log(res);
    });
  };



  return (
    <div>
      <h1>TEST 페이지</h1>

      <p>GET 요청 보내기</p>
      <button type="button" onClick={getRequest}>
        보내기
      </button>
      <br />
      <br />
      <p>에러 확인하기</p>
      <button type="button" onClick={makeError}>
        에러발생시키기
      </button>
    </div>
  );
}
export default Test;
import { useState } from "react";

const BoardList = (props) => {
  const [boardType, setBoardType] = useState(props);
  const [sortBy, setSortBy] = useState("desc");
  const [condition, setCondition] = useState("username");
  const [keyword, setKeyword] = useState("");
  return (
    <>
      <div className="w-full min-h-full flex flex-col justify-between">
        <section className="font-PyeojinGothicB flex justify-between items-center">
          <div className="ml-1 text-3xl">게시판 제목</div>
          <div className="mr-1 flex items-center gap-4">
            <div className="text-xl">정렬 기준</div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-1 border-2 border-gray-500 rounded-sm text-lg font-PyeojinGothicM text-center"
            >
              <option value="desc">최신순</option>
              <option value="asc">등록순</option>
            </select>
          </div>
        </section>
        <section className="bg-saintralightblue rounded-md">
          <table className="table-fixed w-full border-separate border-spacing-4">
            <thead className="font-PyeojinGothicB text-lg">
              <tr>
                <th className="w-1/8">번호</th>
                <th className="w-4/8">제목</th>
                <th className="w-2/8">작성자</th>
                <th className="w-1/8">작성일</th>
              </tr>
            </thead>
            <tbody className="font-PretendardM text-center">
              <tr>
                <td>1</td>
                <td>게시물 제목</td>
                <td>realname(username)</td>
                <td>0000.00.00</td>
              </tr>
              <tr>
                <td>2</td>
                <td>게시물 제목</td>
                <td>작성자 이름</td>
                <td>00:00</td>
              </tr>
              <tr>
                <td>3</td>
                <td>게시물 제목</td>
                <td>작성자 이름</td>
                <td>00:00</td>
              </tr>
              <tr>
                <td>4</td>
                <td>게시물 제목</td>
                <td>작성자 이름</td>
                <td>00:00</td>
              </tr>
              <tr>
                <td>5</td>
                <td>게시물 제목</td>
                <td>작성자 이름</td>
                <td>00:00</td>
              </tr>
              <tr>
                <td>6</td>
                <td>게시물 제목</td>
                <td>작성자 이름</td>
                <td>00:00</td>
              </tr>
              <tr>
                <td>7</td>
                <td>게시물 제목</td>
                <td>작성자 이름</td>
                <td>00:00</td>
              </tr>
              <tr>
                <td>8</td>
                <td>게시물 제목</td>
                <td>작성자 이름</td>
                <td>00:00</td>
              </tr>
              <tr>
                <td>9</td>
                <td>게시물 제목</td>
                <td>작성자 이름</td>
                <td>00:00</td>
              </tr>
              <tr>
                <td>10</td>
                <td>게시물 제목</td>
                <td>작성자 이름</td>
                <td>00:00</td>
              </tr>
              <tr>
                <td>11</td>
                <td>게시물 제목</td>
                <td>작성자 이름</td>
                <td>00:00</td>
              </tr>
              <tr>
                <td>12</td>
                <td>게시물 제목</td>
                <td>작성자 이름</td>
                <td>00:00</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="h-fit font-PyeojinGothicB flex justify-between items-center">
          <div className="ml-1 flex justify-start gap-1">
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="border-2 border-gray-500 rounded-sm text-lg font-PyeojinGothicM text-center"
            >
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="writer">작성자</option>
            </select>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-1/2 h-full px-2 py-1 font-PretendardM text-lg border-2 border-gray-500 rounded-sm"
            />
            <button type="button" className="px-2 bg-saintragreen rounded-sm text-white">
              검색
            </button>
          </div>
          <div className="mr-1 text-gray-500 flex justify-center gap-1">
            <div className="w-12 h-9 border-2 border-gray-500 rounded-sm flex justify-center items-center">이전</div>
            <div className="size-9 border-2 border-gray-500 rounded-sm flex justify-center items-center">1</div>
            <div className="size-9 border-2 border-gray-500 rounded-sm flex justify-center items-center">2</div>
            <div className="size-9 border-2 border-gray-500 rounded-sm flex justify-center items-center">3</div>
            <div className="size-9 border-2 border-gray-500 rounded-sm flex justify-center items-center">4</div>
            <div className="size-9 border-2 border-gray-500 rounded-sm flex justify-center items-center">5</div>
            <div className="size-9 border-2 border-gray-500 rounded-sm flex justify-center items-center">6</div>
            <div className="size-9 border-2 border-gray-500 rounded-sm flex justify-center items-center">7</div>
            <div className="size-9 border-2 border-gray-500 rounded-sm flex justify-center items-center">8</div>
            <div className="size-9 border-2 border-gray-500 rounded-sm flex justify-center items-center">9</div>
            <div className="size-9 border-2 border-gray-500 rounded-sm flex justify-center items-center">10</div>
            <div className="w-12 h-9 border-2 border-gray-500 rounded-sm flex justify-center items-center">다음</div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BoardList;

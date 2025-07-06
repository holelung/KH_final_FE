import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiService } from "../../../api/apiService";

const BoardList = () => {
  const [type, setType] = useState("");
  const [page, setPage] = useState("");
  const [condition, setCondition] = useState("title");
  const [keyword, setKeyword] = useState("");
  const [boardTitle, setBoardTitle] = useState("");
  const [boardList, setBoardList] = useState([]);
  const [startButton, setStartButton] = useState(1);
  const [endButton, setEndButton] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();

  const navi = useNavigate();

  useEffect(() => {
    setType(searchParams.get("type"));
    setPage(searchParams.get("page"));

    if (searchParams.get("condition")) {
      setCondition(searchParams.get("condition"));
    }

    if (searchParams.get("keyword")) {
      setKeyword(searchParams.get("keyword"));
    }
  }, [searchParams]);

  useEffect(() => {
    if (type && page) {
      switch (type) {
        case "bulletin":
          setBoardTitle("공지사항");
          break;
        case "free":
          setBoardTitle("자유게시판");
          break;
        case "anonymous":
          setBoardTitle("익명게시판");
          break;
        default:
          setBoardTitle("부서게시판");
      }
      apiService
        .get(`http://localhost:8080/api/boards?${searchParams.toString()}`)
        .then((res) => {
          console.log(res);
          setBoardList(res.data.data.boardList);
          setStartButton(res.data.data.startButton);
          setEndButton(res.data.data.endButton);
          setMaxPage(res.data.data.maxPage);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [type, page]);

  const handleCondition = (e) => {
    setCondition(e.target.value);
  };

  const handleKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearch = () => {
    if (!condition || !keyword) {
      alert("검색 조건 또는 검색어 누락");
      return;
    }

    searchParams.set("page", 1);
    searchParams.set("condition", condition);
    searchParams.set("keyword", keyword);
    setSearchParams(searchParams);

    apiService
      .get(`http://localhost:8080/api/boards?${searchParams.toString()}`)
      .then((res) => {
        console.log(res.data);
        setBoardList(res.data.data.boardList);
        setStartButton(res.data.data.startButton);
        setEndButton(res.data.data.endButton);
        setMaxPage(res.data.data.maxPage);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePage = (e) => {
    searchParams.set("page", e.target.innerHTML);
    setSearchParams(searchParams);
    setPage(parseInt(e.target.innerHTML));
  };

  return (
    <>
      <div className="w-full min-h-full flex flex-col justify-start gap-2">
        <section className="font-PyeojinGothicB flex justify-between items-center">
          <div
            onClick={() => {
              if (page !== 1) {
                searchParams.set("page", 1);
                setSearchParams(searchParams);
                setPage(1);
              }
            }}
            className="ml-1 text-3xl cursor-pointer"
          >
            {boardTitle}
          </div>
          <div>
            <button
              onClick={() => {
                navi("/boards/edit", { state: { type: type } });
              }}
              className="px-2 py-1 mr-1 border-2 rounded-sm text-lg cursor-pointer"
            >
              글 쓰기
            </button>
          </div>
        </section>
        <section className="flex flex-col justify-between gap-2">
          <section className="bg-saintralightblue rounded-md">
            <table className="table-fixed w-full border-separate border-spacing-4">
              <thead className="font-PyeojinGothicB text-lg">
                {type === "anonymous" ? (
                  <tr>
                    <th className="w-1/8">번호</th>
                    <th className="w-6/8">제목</th>
                    <th className="w-1/8">작성일</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="w-1/8">번호</th>
                    <th className="w-4/8">제목</th>
                    <th className="w-2/8">작성자</th>
                    <th className="w-1/8">작성일</th>
                  </tr>
                )}
              </thead>
              <tbody className="font-PretendardM text-center">
                {boardList.length > 0 ? (
                  type === "anonymous" ? (
                    boardList.map((board) => (
                      <tr
                        key={board.id}
                        onClick={() => {
                          navi(`/boards/detail?type=${type}&boardId=${board.id}`);
                        }}
                      >
                        <td>{board.id}</td>
                        <td>{board.title}</td>
                        <td>{board.createDate}</td>
                      </tr>
                    ))
                  ) : (
                    boardList.map((board) => (
                      <tr
                        key={board.id}
                        onClick={() => {
                          navi(`/boards/detail?type=${type}&boardId=${board.id}`);
                        }}
                      >
                        <td>{board.id}</td>
                        <td>{board.title}</td>
                        <td>
                          {board.realname}({board.username})
                        </td>
                        <td>{board.createDate}</td>
                      </tr>
                    ))
                  )
                ) : (
                  <tr>
                    <td colSpan={4}>게시물이 없습니다</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
          <section className="h-fit font-PyeojinGothicB flex justify-between items-center">
            <div className="ml-1 flex justify-start gap-1">
              <select value={condition} onChange={handleCondition} className="border-2 border-gray-500 rounded-sm text-lg font-PyeojinGothicM text-center">
                <option value="title">제목</option>
                <option value="content">내용</option>
                {type === "anonymous" ? "" : <option value="writer">작성자</option>}
              </select>
              <input
                type="text"
                value={keyword}
                onChange={handleKeyword}
                className="w-1/2 h-full px-2 py-1 font-PretendardM text-lg border-2 border-gray-500 rounded-sm"
              />
              <button type="button" onClick={handleSearch} className="px-2 bg-saintragreen rounded-sm text-white cursor-pointer">
                검색
              </button>
            </div>
            <div className="mr-1 text-gray-500 flex justify-center gap-1">
              {startButton === 1 ? (
                <></>
              ) : (
                <div className="w-12 h-9 border-2 border-gray-500 rounded-sm flex justify-center items-center cursor-pointer">이전</div>
              )}
              {[...Array(parseInt(maxPage))].map((n, index) => (
                <div
                  key={index}
                  onClick={handlePage}
                  className={`size-9 border-2 border-gray-500 rounded-sm flex justify-center items-center cursor-pointer ${page == index + 1 ? `bg-saintrablue` : ``}`}
                >
                  {index + 1}
                </div>
              ))}
              {endButton === maxPage ? (
                <div className="w-12 h-9 border-2 border-gray-500 rounded-sm flex justify-center items-center cursor-pointer">다음</div>
              ) : (
                <></>
              )}
            </div>
          </section>
        </section>
      </div>
    </>
  );
};

export default BoardList;

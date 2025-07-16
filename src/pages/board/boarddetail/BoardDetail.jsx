import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import parse from "html-react-parser";
import { apiService } from "../../../api/apiService";
import { AuthContext } from "../../../Context/AuthContext";
import { toast } from "react-toastify";
import Loading from "../../../Components/Loading/Loading";
import { number } from "prop-types";
import axios from "axios";

const BoardDetail = () => {
  const [type, setType] = useState("");
  const [boardId, setBoardId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [realname, setRealname] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentPage, setCommentPage] = useState(1);
  const [commentList, setCommentList] = useState([]);
  const [startButton, setStartButton] = useState(1);
  const [endButton, setEndButton] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [commentSub, setCommentSub] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { auth } = useContext(AuthContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const navi = useNavigate();

  useEffect(() => {
    setType(searchParams.get("type"));
    setBoardId(Number(searchParams.get("boardId")));
  }, [searchParams]);

  useEffect(() => {
    if (type && boardId) {
      setIsLoading(true);
      apiService
        .get(`/boards/detail?${searchParams.toString()}`)
        .then((res) => {
          setTitle(res.data.data.boardDetail.title);
          setContent(res.data.data.boardDetail.content);
          setCreateDate(res.data.data.boardDetail.createDate);
          setUserId(res.data.data.boardDetail.userId);
          setUsername(res.data.data.boardDetail.username);
          setRealname(res.data.data.boardDetail.realname);
        })
        .catch((err) => {
          toast.error(`${err.code}: 잘못된 접근 입니다.`);
          navi(-1);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [type, boardId]);

  useEffect(() => {
    if (type && boardId) {
      setIsLoading(true);
      apiService
        .get(`/comments?${searchParams.toString()}&page=${commentPage}`)
        .then((res) => {
          setCommentList(res.data.data.commentList);
          setStartButton(res.data.data.startButton);
          setEndButton(res.data.data.endButton);
          setMaxPage(res.data.data.maxPage);
        })
        .catch((err) => {
          toast.error(`${err}: 잘못된 접근 입니다.`);
          navi(-1);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [type, boardId, commentPage, commentSub]);

  const handleDeleteBoard = (e) => {
    if (!window.confirm("게시물을 삭제 하시겠습니까?")) {
      return;
    }
    apiService
      .delete(`/boards?type=${type}&boardId=${boardId}&userId=${userId}`)
      .then((res) => {
        navi(`/boards?type=${type}&page=1`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCommentContent = (e) => {
    setCommentContent(e.target.value);
  };

  const handleCommentPage = (e) => {
    setCommentPage(e.target.innerHTML);
  };

  const handleCommentSubmit = () => {
    if (type && boardId && commentContent) {
      setIsLoading(true);
      apiService
        .post(`/comments`, { type: type, boardId: boardId, content: commentContent })
        .then((res) => {
          setCommentContent("");
          setCommentPage(1);
          setCommentSub(!commentSub);
        })
        .catch((err) => {
          toast.error(`${err}: 잘못된 접근 입니다.`);
          navi(-1);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleDeleteComment = (e) => {
    if (!window.confirm("댓글을 삭제 하시겠습니까?")) {
      return;
    }
    const commentId = Number(e.target.id.substr(12));
    apiService
      .delete(`/comments?type=${type}&boardId=${boardId}&commentId=${commentId}&userId=${userId}`)
      .then((res) => {
        setCommentSub(!commentSub);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {isLoading ? <Loading /> : <></>}
      <div className="w-full min-h-full flex flex-col gap-2 font-PyeojinGothicM">
        <section className="w-full flex flex-col gap-2">
          <div className="w-full flex justify-between items-center font-PyeojinGothicB text-slate-600 text-2xl">
            <div>{title ? title : "글 제목"}</div>
            {userId == auth.loginInfo.id ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    navi("/boards/edit", { state: { type: type, boardId: boardId, userId: userId, title: title, content: content, isUpdate: true } })
                  }
                  className="h-full px-2 font-PyeojinGothicM text-lg text-white bg-yellow-400 hover:bg-yellow-300 rounded-sm cursor-pointer"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteBoard()}
                  className="h-full px-2 font-PyeojinGothicM text-lg text-white bg-red-500 hover:bg-red-400 rounded-sm cursor-pointer"
                >
                  삭제
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="w-full flex justify-end gap-2">
            {type === "anonymous" ? (
              ""
            ) : (
              <>
                <div className="text-slate-900">작성자 |</div>
                <div className="text-slate-600">{realname && username ? `${realname}(${username})` : "작성자"}</div>
              </>
            )}
            <div className="text-slate-900">작성일 |</div>
            <div className="text-slate-600">{createDate ? createDate : "작성일"}</div>
          </div>
        </section>
        <section className="w-full min-h-[25rem] px-2 py-4 border-y-2 border-slate-300 text-slate-900">
          <div>{content ? parse(content) : "글 내용"}</div>
        </section>
        <section className="w-full flex flex-col gap-2">
          <div className="w-full flex gap-2">
            <textarea
              value={commentContent}
              onChange={handleCommentContent}
              type="text"
              placeholder="댓글 내용을 입력 하세요."
              className="w-5/6 h-24 p-2 border-2 border-slate-300 rounded-md resize-none"
            />
            <button onClick={handleCommentSubmit} type="button" className="w-1/6 bg-green-300 hover:bg-green-400 rounded-md text-2xl text-white cursor-pointer">
              등록
            </button>
          </div>
          {commentList.length > 0 ? (
            commentList.map((comment) =>
              type === "anonymous" ? (
                <div key={comment.id} className="w-full border-t-2 border-slate-300 flex-col gap-2">
                  <div className="px-2 py-1 text-lg border-b-1 border-slate-300 flex justify-between">
                    <div>익명의 댓글</div>
                    {auth.loginInfo.id == comment.userId ? (
                      <div className="flex gap-1">
                        <button type="button" className="h-full px-2 text-white bg-yellow-400 hover:bg-yellow-300 rounded-sm cursor-pointer">
                          수정
                        </button>
                        <button type="button" className="h-full px-2 text-white bg-red-500 hover:bg-red-400 rounded-sm cursor-pointer">
                          삭제
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="px-3 py-1 flex justify-between">
                    <div>{comment.content}</div>
                    <div>{comment.createDate}</div>
                  </div>
                </div>
              ) : (
                <div key={comment.id} className="w-full border-t-2 border-slate-300 flex-col gap-2">
                  <div className="px-2 py-1 text-lg border-b-1 border-slate-300 text-slate-900 flex justify-between">
                    <div>
                      {comment.realname}({comment.username})
                    </div>
                    {auth.loginInfo.id == comment.userId ? (
                      <div className="flex gap-2">
                        <button
                          id={"DeleteButton" + comment.id}
                          type="button"
                          onClick={(e) => {
                            handleDeleteComment(e);
                          }}
                          className="h-full px-2 text-white bg-red-500 hover:bg-red-400 rounded-sm cursor-pointer"
                        >
                          삭제
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="px-3 py-1 flex justify-between text-slate-900">
                    <div>{comment.content}</div>
                    <div>{comment.createDate}</div>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="w-full border-t-2 border-slate-300 flex-col gap-2">
              <div className="px-2 py-1 border-b-1 border-slate-300 text-slate-900 text-lg">댓글이 없습니다.</div>
              <div className="px-2 py-1 flex justify-between"></div>
            </div>
          )}
          <div className="mr-1 text-slate-600 flex justify-center gap-1">
            {startButton === 1 ? (
              <></>
            ) : (
              <div className="w-12 h-9 border-2 border-slate-600 rounded-sm flex justify-center items-center cursor-pointer">이전</div>
            )}
            {[...Array(parseInt(maxPage))].map((n, index) => (
              <div
                key={index}
                onClick={handleCommentPage}
                className={`size-9 border-2 rounded-sm flex justify-center items-center cursor-pointer ${commentPage == index + 1 ? `bg-slate-300` : ``}`}
              >
                {index + 1}
              </div>
            ))}
            {endButton === maxPage ? <div className="w-12 h-9 border-2 rounded-sm flex justify-center items-center cursor-pointer">다음</div> : <></>}
          </div>
        </section>
      </div>
    </>
  );
};

export default BoardDetail;

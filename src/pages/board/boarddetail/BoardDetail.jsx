import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import parse from "html-react-parser";
import { apiService } from "../../../api/apiService";
import { AuthContext } from "../../../Context/AuthContext";
import { toast } from "react-toastify";
import Loading from "../../../Components/Loading/Loading";

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

  useEffect(() => {}, [isLoading]);

  useEffect(() => {
    setType(searchParams.get("type"));
    setBoardId(searchParams.get("boardId"));
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

  return (
    <>
      {isLoading ? <Loading /> : <></>}
      <div className="w-full min-h-full flex flex-col gap-2">
        <section className="w-full flex flex-col gap-2">
          <div className="w-full text-2xl flex justify-between items-center">
            <div>{title ? title : "글 제목"}</div>
            {userId == auth.loginInfo.id ? (
              <div className="flex gap-1">
                <button type="button" className="h-full px-2 text-lg text-white bg-yellow-300 rounded-sm">
                  수정
                </button>
                <button type="button" className="h-full px-2 text-lg text-white bg-red-500 rounded-sm">
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
                <div>작성자 |</div>
                <div className="text-gray-500">{realname && username ? `${realname}(${username})` : "작성자"}</div>
              </>
            )}
            <div>작성일 |</div>
            <div className="text-gray-500">{createDate ? createDate : "작성일"}</div>
          </div>
        </section>
        <section className="w-full px-2 py-4 border-y-2 border-saintragray">
          <div>{content ? parse(content) : "글 내용"}</div>
        </section>
        <section className="w-full flex flex-col gap-2">
          <div className="w-full flex gap-2">
            <textarea
              value={commentContent}
              onChange={handleCommentContent}
              type="text"
              placeholder="댓글 내용을 입력 하세요."
              className="w-5/6 h-24 p-2 border-2 border-saintragray rounded-md resize-none"
            />
            <button onClick={handleCommentSubmit} type="button" className="w-1/6 bg-saintragreen rounded-md text-xl">
              등록
            </button>
          </div>
          {commentList.length > 0 ? (
            commentList.map((comment) =>
              type === "anonymous" ? (
                <div key={comment.id} className="w-full border-t-2 border-saintragray flex-col gap-2">
                  <div className="px-2 py-1 text-lg border-b-1 border-saintragray flex justify-between">
                    <div>익명의 댓글</div>
                    {auth.loginInfo.id == comment.userId ? (
                      <div className="flex gap-1">
                        <button type="button" className="h-full px-2 text-white bg-yellow-300 rounded-sm">
                          수정
                        </button>
                        <button type="button" className="h-full px-2 text-white bg-red-500 rounded-sm">
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
                <div key={comment.id} className="w-full border-t-2 border-saintragray flex-col gap-2">
                  <div className="px-2 py-1 text-lg border-b-1 border-saintragray flex justify-between">
                    <div>
                      {comment.realname}({comment.username})
                    </div>
                    {auth.loginInfo.id == comment.userId ? (
                      <div className="flex gap-1">
                        <button type="button" className="h-full px-2 text-white bg-yellow-300 rounded-sm">
                          수정
                        </button>
                        <button type="button" className="h-full px-2 text-white bg-red-500 rounded-sm">
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
              )
            )
          ) : (
            <div className="w-full border-t-2 border-saintragray flex-col gap-2">
              <div className="px-2 py-1 border-b-1 border-saintragray text-lg">댓글이 없습니다.</div>
              <div className="px-2 py-1 flex justify-between"></div>
            </div>
          )}
          <div className="mr-1 text-gray-500 flex justify-center gap-1">
            {startButton === 1 ? (
              <></>
            ) : (
              <div className="w-12 h-9 border-2 border-gray-500 rounded-sm flex justify-center items-center cursor-pointer">이전</div>
            )}
            {[...Array(parseInt(maxPage))].map((n, index) => (
              <div
                key={index}
                onClick={handleCommentPage}
                className={`size-9 border-2 border-gray-500 rounded-sm flex justify-center items-center cursor-pointer ${commentPage == index + 1 ? `bg-saintrablue` : ``}`}
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
      </div>
    </>
  );
};

export default BoardDetail;

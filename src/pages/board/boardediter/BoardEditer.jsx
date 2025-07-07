import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { apiService } from "../../../api/apiService";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BoardEditer = () => {
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const quillRef = useRef(null);

  const navi = useNavigate();

  const location = useLocation();

  useEffect(() => {
    console.log(content);
    console.log(imageFiles);
    console.log(attachedFiles);
  }, [content, imageFiles, attachedFiles]);

  useEffect(() => {
    if (!location.state) {
      toast.error("잘못된 접근 입니다.");
      navi(-1);
    }
    setType(location.state.type);
  }, []);

  useEffect(() => {
    const editor = quillRef.current.getEditor();
    // 1) 마운트 시점에 에디터 안에 있는 파일 ID들 초기화
    let prevFileIds = new Set(Array.from(editor.root.querySelectorAll("img[data-file-id]")).map((img) => img.getAttribute("data-file-id")));

    const onTextChange = (_, __, source) => {
      if (source !== "user") return;
      const currFileIds = new Set(Array.from(editor.root.querySelectorAll("img[data-file-id]")).map((img) => img.getAttribute("data-file-id")));
      // 삭제된 파일 ID 찾기
      for (let fileId of prevFileIds) {
        if (!currFileIds.has(fileId)) {
          apiService
            .delete(`/files/boards/${fileId}`)
            .then(() => {
              setImageFiles((ids) => ids.filter((id) => id !== fileId));
            })
            .catch(console.error);
        }
      }
      prevFileIds = currFileIds;
    };

    editor.on("text-change", onTextChange);
    return () => editor.off("text-change", onTextChange);
  }, []);

  const customModules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["image"],
      ],
      handlers: {
        image: () => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");

          const editor = quillRef.current.getEditor();
          const range = editor.getSelection(true);

          input.click();
          input.onchange = () => {
            if (input.files && input.files[0]) {
              // 업로드 + 삽입을 모두 uploadImageFile 에서 처리
              uploadImageFile(input.files[0], range.index);
            }
          };
        },
      },
    },
  };

  const isImageFile = (file) => {
    return file.type.startsWith("image/");
  };

  const handleFileUpload = (file) => {
    if (isImageFile(file)) {
      uploadImageFile(file);
    } else {
      uploadAttachedFile(file);
    }
  };

  const uploadImageFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    apiService
      .post(`/files/boards`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res);
        const imgTag = `<img src="${res.data.data.url}" data-file-id="${res.data.data.fileId}" alt="${res.data.data.origin}" />`;
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(); // 현재 커서 위치
        if (range) {
          quill.insertEmbed(range.index, "image", res.data.data.url);
        }
        setImageFiles((prev) => [...prev, res.data.data.fileId]);
        setTimeout(() => {
          const imgs = quill.root.querySelectorAll(`img[src="${res.data.data.url}"]`);
          imgs.forEach((img) => img.setAttribute("data-file-id", res.data.data.fileId));
        }, 0);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadAttachedFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    apiService
      .post(`/files/boards`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res);
        setAttachedFiles((prev) => [...prev, res.data.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleContent = (e) => {
    setContent(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(type);
    apiService
      .post(`/boards`, { type: type, title: title, content: content, imageFiles: imageFiles })
      .then((res) => {
        console.log(res);
        console.log(type);
        navi(`/boards/detail?type=${type}&boardId=${res.data.data}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="w-full min-h-full flex flex-col justify-between gap-2">
        <section className="h-max flex flex-col gap-2">
          <div className="ml-1 font-PyeojinGothicB text-3xl text-saintrablack">게시물 작성</div>
          <div>
            <input
              value={title}
              onChange={handleTitle}
              type="text"
              placeholder="제목"
              className="w-full px-4 py-2 border-1 font-PyeojinGothicM border-gray-300"
            />
          </div>
          {attachedFiles.length > 0 && (
            <div>
              <h3>첨부파일 목록</h3>
              <ul>
                {attachedFiles.map((file) => (
                  <li key={file.id}>
                    {file.name}
                    <button onClick={() => setAttachedFiles(attachedFiles.filter((f) => f.id !== file.id))}>삭제</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ReactQuill ref={quillRef} value={content} onChange={handleContent} modules={customModules} theme="snow" className="quill-editor" />
        </section>
        <section>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                navi(-1);
              }}
              type="button"
              className="px-2 py-1 bg-saintrablack text-white text-lg rounded-sm"
            >
              돌아가기
            </button>
            <button onClick={handleSubmit} className="px-2 py-1 bg-saintragreen text-white text-lg rounded-sm">
              작성
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default BoardEditer;

import { useState } from "react";
import ReactQuill from "react-quill-new";
import { useDropzone } from "react-dropzone";
import "react-quill-new/dist/quill.snow.css";
import { apiService } from "../../../api/apiService";
import { useNavigate } from "react-router-dom";

const BoardEditer = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const navi = useNavigate();

  const customModules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: () => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.click();

          input.onchange = () => {
            if (input.files && input.files[0]) {
              const url = handleFileUpload(input.files[0]);
              if (url) {
                const range = window.getSelection().getRangeAt(0);
                window.quill.insertEmbed(range.index, "image", url);
              }
            }
          };
        },
      },
    },
  };

  const isImageFile = (file) => {
    return file.type.startsWith("image/");
  };

  const handleFileUpload = (files) => {
    for (const file of files) {
      if (isImageFile(file)) {
        uploadImageFile(file);
      } else {
        uploadAttachedFile(file);
      }
    }
  };

  const uploadImageFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    apiService
      .post(``, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res);
        const imgTag = `<img src="${res.data.data.url}" data-file-id="${res.data.data.id}" alt="${file.name}" />`;
        setContent((prev) => prev + imgTag);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadAttachedFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    apiService
      .post(``, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res);
        setAttachedFiles((prev) => [...prev, response.data.data]);
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
    apiService
      .post(``, { type: type, itle: title, content: content, imageFiles: imageFiles, attachedFiles: attachedFiles })
      .then((res) => {
        console.log(res);
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
            <input value={title} onChange={handleTitle} type="text" placeholder="제목" className="w-full p-2 border-1 font-PyeojinGothicM border-gray-300" />
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
          <ReactQuill value={content} onChange={handleContent} modules={customModules} theme="snow" />
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

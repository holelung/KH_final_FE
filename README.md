
# Saintra Frontend

**Project Name:** `saintra-front`  
**Version:** `0.0.0`  
**Module Type:** ES Module :contentReference[oaicite:0]{index=0}

---

## Overview

Saintra 프론트엔드 애플리케이션은 KH 파이널 프로젝트의 사용자 인터페이스를 담당합니다.  
React와 Vite 기반으로 빠르고 가벼운 개발 환경을 제공하며, Tailwind CSS를 활용해 모던하고 반응형 UI/UX를 구현합니다.

---

## Features

- **JWT 인증 & 토큰 관리**: `react-cookie` + Axios 인터셉터로 자동 토큰 삽입  
- **실시간 채팅 & 상태 표시**: `@stomp/stompjs`, `sockjs-client`, `react-use-websocket` 이용   
- **리치 텍스트 에디터**: Quill 기반 게시판 기능 (`react-quill-new`, `react-quilljs`) 
- **파일 업로드**: `react-dropzone`으로 이미지/파일 첨부 지원 
- **주소 검색**: Daum 우편번호 API 연동 (`react-daum-postcode`)
- **캘린더 & 스케줄 관리**: `@fullcalendar/react` + dayGrid, interaction, resource-timeline 플러그인 
- **알림 UI**: `react-toastify`를 이용한 토스트 메시지 
- **라우팅**: `react-router-dom` 기반 SPA 내비게이션 
- **스타일링**: Tailwind CSS, `@heroicons/react`, `tailwind-scrollbar-hide`   

---

## Tech Stack

- **Framework & Tooling:**  
  - React ^19.1.0, Vite ^6.3.5, `@vitejs/plugin-react-swc`  
- **Styling:**  
  - Tailwind CSS ^4.1.10, `@tailwindcss/vite`  
- **State & Data Fetching:**  
  - Axios, React Cookie  
- **Real‑time & WebSockets:**  
  - `@stomp/stompjs`, SockJS Client, `react-use-websocket`  
- **Rich Text & File Handling:**  
  - Quill (`react-quill-new`, `react-quilljs`), `react-dropzone`, `html-react-parser`  
- **Calendar:**  
  - FullCalendar Core + DayGrid + Interaction + Resource-Timeline  
- **Utilities:**  
  - `react-icons`, `@heroicons/react`, `react-toastify`, `react-daum-postcode`  
- **Lint & Format:**  
  - ESLint (`@eslint/js`, `eslint-plugin-react`, `eslint-plugin-react-hooks`), Prettier  
- **Project Config:**  
  - Vite, ESLint, Prettier, Tailwind CSS, VSCode Settings   

---

## Prerequisites

- **Node.js** v16 이상  
- **npm** 또는 **Yarn**

---

## Installation

1. 리포지토리 클론  
   ```bash
   git clone https://github.com/holelung/KH_final_FE.git
   cd KH_final_FE
  ```

2. 의존성 설치

   ```bash
   npm install
   # 또는
   yarn install
   ```

---

## Environment Variables

프로젝트 루트에 `.env` 파일을 생성하고 아래 값을 설정하세요:

```env
VITE_API_URL=https://your.api.endpoint
VITE_WS_URL=ws://your.api.endpoint/ws
# (필요 시 추가 환경 변수)
```

---

## Available Scripts

* **개발 서버**

  ```bash
  npm run dev
  # 또는
  yarn dev
  ```
* **프로덕션 빌드**

  ```bash
  npm run build
  # 또는
  yarn build
  ```
* **Lint 검사**

  ```bash
  npm run lint
  # 또는
  yarn lint
  ```
* **빌드 결과 미리보기**

  ```bash
  npm run preview
  # 또는
  yarn preview
  ```

---

## Project Structure

```
KH_final_FE/
├── .github/                 # CI/CD 워크플로우
├── public/
│   └── index.html
├── src/
│   ├── assets/              # 이미지, 아이콘 등 정적 자원
│   ├── components/          # 재사용 가능한 컴포넌트
│   ├── pages/               # 화면 단위 컴포넌트
│   ├── services/            # API 호출 및 인증 로직
│   ├── hooks/               # 커스텀 훅
│   ├── styles/              # 전역 스타일 (Tailwind 설정 등)
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── .prettierignore
├── .prettierrc
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Contributing

1. 이슈(issues) 열기
2. 풀 리퀘스트(pull request) 생성
3. 코드 리뷰 후 머지

# 🗺️ SchemeLand 프로젝트 구조 (Project Map)

이 문서는 **SchemeLand 앱**의 파일들이 어디에 있고, 각각 무슨 역할을 하는지 상세하게 설명하는 지도입니다.

---

## 📂 전체 구조 요약
```text
schemeland/
├── node_modules/       # (자동 생성) 설치된 라이브러리들 - 건드리지 마세요!
├── components/         # 🧩 레고 블록들 (화면 구성 요소)
│   ├── views/          # 🖼️ 화면들 (현관, 거실, 안방...)
│   │   ├── LandingView.tsx      # 첫 시작 화면
│   │   ├── ProjectListView.tsx  # 프로젝트 목록 화면
│   │   ├── BrainDumpView.tsx    # 아이디어 입력 화면
│   │   ├── AnalysisView.tsx     # AI 분석 화면
│   │   └── DashboardView.tsx    # 메인 대시보드 (게임 화면)
│   ├── Button.tsx      # 재사용 가능한 버튼
│   └── IdeaCard.tsx    # 아이디어 카드 모양
├── services/           # 🤖 일꾼들 (비즈니스 로직)
│   └── geminiService.ts# AI(Gemini)와 대화하는 통역사
├── docs/               # 📚 설명서 폴더
│   ├── learning_journal.md      # 배움 노트 (일지)
│   ├── coding_fundamentals.md   # 기초 개념 사전
│   └── project_structure.md     # (본 문서) 파일 구조 설명서
├── App.tsx             # 🏠 중앙 통제실 (전체 앱의 뼈대)
├── types.ts            # 🏷️ 이름표 사전 (데이터들의 모양 정의)
└── vite.config.ts      # ⚙️ 설정 파일 (서버 설정 등)
```

---

## 🔍 주요 파일 상세 설명

### 1. 🏠 핵심 파일
-   **`App.tsx`**: 우리 앱의 **"심장"**입니다.
    -   앱이 켜지면 제일 먼저 실행됩니다.
    -   데이터(State)를 관리하고, 현재 상황에 맞는 화면(View)을 보여주는 교통정리를 담당합니다.
    -   데이터 저장(Local Storage) 로직도 여기에 있습니다.

-   **`types.ts`**: **"데이터 명세서"**입니다.
    -   우리 앱에서 사용하는 데이터들이 어떻게 생겼는지 정의합니다.
    -   예: "`ProjectIdea`라는 데이터는 제목(title)과 설명(description)을 가져야 한다"라고 규칙을 정해두는 곳입니다.

### 2. 🧩 Components (화면 조각들)
`components/views/` 폴더에는 사용자가 보게 될 5개의 주요 화면이 들어있습니다.

1.  **`LandingView.tsx`**: **"대문"**
    -   앱을 처음 켰을 때 나오는 환영 인사 화면.
    -   "새 아이디어 시작하기" 버튼이 있습니다.

2.  **`BrainDumpView.tsx`**: **"생각 쓰레기통"**
    -   떠오르는 아이디어를 마구 적는 곳입니다.
    -   AI가 아이디어를 구체화해주는 기능도 연결되어 있습니다.

3.  **`AnalysisView.tsx`**: **"분석실"**
    -   적어낸 아이디어를 AI가 평가(점수 매기기)해주는 화면입니다.
    -   여기서 프로젝트를 "시작(Start)"할지 결정합니다.

4.  **`ProjectListView.tsx`**: **"서재"**
    -   저장된 프로젝트들의 목록을 보여주는 화면입니다.
    -   진행 중인 프로젝트를 클릭해서 대시보드로 이동합니다.

5.  **`DashboardView.tsx`**: **"작전 상황실"**
    -   가장 복잡하고 중요한 화면입니다.
    -   할 일 관리, 레벨업 시스템, 타이머 등 실제 앱을 사용하는 공간입니다.

### 3. 🤖 Services (일꾼)
-   **`geminiService.ts`**: Google의 Gemini AI에게 부탁할 일들을 모아둔 곳입니다.
    -   "아이디어 분석해줘", "주간 계획 짜줘" 같은 함수들이 여기 있습니다.
    -   API 키를 사용하여 구글 서버와 통신합니다.

---

### ❓ 파일이 너무 많아서 헷갈린다면?
1. **화면을 고치고 싶다?** 👉 `components/views/` 안에서 해당 화면 파일을 찾으세요.
2. **AI가 이상한 말을 한다?** 👉 `services/geminiService.ts`를 확인하세요.
3. **앱이 저장을 안 한다?** 👉 `App.tsx`를 확인하세요.

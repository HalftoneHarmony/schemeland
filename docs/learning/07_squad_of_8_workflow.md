# 8인의 AI 용병단 운용 가이드 (The Squad of 8)

혼자서 개발할 때, 마치 8명의 전문가 팀을 거느린 것처럼 작업하기 위한 **업무 분장표**와 **지휘 전략**입니다.
이 가이드는 `SchemeLand` 프로젝트의 실제 구조를 기반으로 작성되었습니다.

---

## 🏛️ 에이전트 분대 편성표 (Squad Setup)

각 에이전트(터미널 탭)마다 명확한 **전문 분야(Specialty)**와 **구역(Territory)**을 정해주는 것이 핵심입니다.

| 에이전트 코드명 | 직책 (Role) | 담당 구역 (Territory) | 구체적인 업무 지시 (Prompt Example) | 브랜치명 (Branch) |
| :--- | :--- | :--- | :--- | :--- |
| **Agent 1** | **🎨 UI/UX 디자이너** | `src/styles/index.css`<br>`src/components/ui/` | "앱 전체 테마를 사이버펑크 스타일로 변경해줘. 버튼에 네온 글로우 효과를 넣고, 전반적인 폰트 가독성을 높여." | `feat/design-overhaul` |
| **Agent 2** | **🧠 AI 로직 설계자** | `src/services/geminiService.ts`<br>`src/utils/aiLogic.ts` | "Gemini가 프로젝트명을 제안할 때 좀 더 간결하고 임팩트 있는 단어 위주로 뽑도록 프롬프트를 튜닝해줘." | `feat/ai-logic-upgrade` |
| **Agent 3** | **📊 데이터 엔지니어** | `src/types.ts`<br>`src/hooks/useLocalStorage.ts` | "데이터 구조(Interface)를 정리해서 나중에 서버랑 연동하기 쉽게 만들어. 타입 정의를 좀 더 엄격하게 잡아줘." | `feat/data-structure` |
| **Agent 4** | **🛡️ QA & 테스터** | `src/utils/validation.ts`<br>`src/types.ts` | "사용자가 날짜를 이상하게 입력하거나 필수 항목을 비워두면 에러 메시지가 친절하게 뜨도록 유효성 검사를 추가해." | `fix/error-handling` |
| **Agent 5** | **🗺️ 대시보드 건축가** | `src/components/views/DashboardView.tsx`<br>`src/components/dashboard/` | "대시보드 화면이 너무 복잡해. 자주 쓰는 '타이머' 기능을 더 크게 만들고, 안 쓰는 기능은 접을 수 있게 해줘." | `feat/dashboard-layout` |
| **Agent 6** | **⚔️ 캠페인 사령관** | `src/components/views/CampaignDetailView.tsx` | "새로운 캠페인 디테일 뷰에 '칸반 보드'를 만들어. 주차별(Week)로 할 일을 드래그해서 옮길 수 있어야 해." | `feat/campaign-kanban` |
| **Agent 7** | **📜 서기관 (Docs)** | `docs/learning/`<br>`README.md` | "지금까지 개발된 기능들을 문서에 정리하고, 새로 온 사용자를 위한 튜토리얼 데이터를 만들어줘." | `docs/update-guide` |
| **Agent 8** | **🚀 마케팅/랜딩** | `src/components/views/LandingView.tsx` | "랜딩 페이지에 스크롤 애니메이션을 추가해서 더 역동적으로 만들어. '시작하기' 버튼 누를 맛이 나게 해줘." | `feat/landing-impact` |

---

## ⚔️ 실전 지휘 시나리오 (Workflow)

**상황**: 당신(Commander)은 일주일 안에 앱을 런칭해야 합니다. 목요일 오후, 8개의 터미널 탭을 열고 지휘를 시작합니다.

### 1단계: 브리핑 및 투입 (Dispatch)
*   **탭 1 (Agent 1 - UI)**: `git checkout -b design` → "버튼 전부 둥글게 깎아."
*   **탭 6 (Agent 6 - Campaign)**: `git checkout -b kanban` → "드래그 앤 드롭 기능 구현해."
*   **탭 8 (Agent 8 - Landing)**: `git checkout -b landing-ani` → "메인 화면 애니메이션 작업 시작해."

### 2단계: 보고 및 병합 (Report & Merge)
1시간 뒤, 에이전트들이 작업을 마쳤다고 보고합니다.

*   **Commander (당신)**: "Agent 1, 작업 끝났어?"
*   **Agent 1**: "네, 버튼 디자인 수정 완료했습니다."
*   **Commander**: "좋아. `main`에 병합(Merge) 한다."
    ```bash
    git checkout main
    git merge design
    ```

### 3단계: 갈등 조정 (Conflict Resolution)
*   **Agent 6**: "대장님! 제가 칸반 보드를 만들었는데, 방금 Agent 1이 바꾼 버튼 디자인이랑 제 코드가 안 맞아서 깨져요."
*   **Commander**: "당황하지 마. Agent 1이 완성한 최신 버전(`main`)을 네 작업대(`kanban`)로 가져와서 맞춰."
    ```bash
    # (탭 6에서)
    git pull origin main  # 메인의 최신 변경사항을 내 브랜치로 가져오기
    # 충돌 해결 후 작업 계속
    ```

---

## 💡 지휘관의 팁 (Commander's Tips)

1.  **구역 침범 금지**: 가장 중요한 규칙입니다. Agent 1이 UI를 고치고 있는데 Agent 2가 갑자기 UI 파일을 건드리면 전쟁(충돌)이 납니다. "너는 여기만 고쳐"라고 명확히 선을 그어주세요.
2.  **작게, 자주**: 에이전트에게 "앱 전체를 만들어줘"라고 하면 실패합니다. "로그인 버튼만 만들어", "헤더만 고쳐"처럼 잘게 쪼개서 시키세요.
3.  **메인(Main)은 신성하다**: 작업 중인 브랜치(실험실)는 망가져도 되지만, `main` 브랜치(본부)는 항상 정상 작동해야 합니다. 확신이 들 때만 병합하세요.

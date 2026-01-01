# 18. SchemeLand 데이터 구조 가이드 (비개발자 및 에이전트 협업용)

> 💡 **이 문서의 목적**: SchemeLand의 데이터가 어떻게 저장되고 관리되는지, 그리고 AI 에이전트에게 코딩 작업을 시킬 때 어떻게 설명해야 정확한 결과를 얻을 수 있는지 안내합니다.

---

## 🏗️ 1. 데이터 베이스 구조 비유 (도서관 모델)

SchemeLand의 데이터베이스는 거대하고 정리가 잘 된 **도서관**과 같습니다. 예전에는 모든 책(데이터)이 바닥에 쌓여 있었다면(App.tsx), 지금은 체계적인 **서가(Slice)**에 정리되어 있습니다.

### 📚 서가(Store Slices) 구조

| 서가 이름 (Slice) | 역할 | 비유 | 파일 위치 |
|---|---|---|---|
| **ideaSlice** | 아이디어 보관 | 💡 아이디어 포스트잇이 붙은 칠판 | `store/slices/ideaSlice.ts` |
| **projectSlice** | 프로젝트 관리 | 📁 프로젝트 계획서가 꽂힌 파일철 | `store/slices/projectSlice.ts` |
| **taskSlice** | 할 일(태스크) 관리 | ✅ 체크리스트 목록 | `store/slices/taskSlice.ts` |
| **analysisSlice** | AI 분석 결과 | 🤖 AI가 작성한 분석 보고서 | `store/slices/analysisSlice.ts` |
| **weekSlice** | 주간 계획 | 📅 주간 스케줄러 | `store/slices/weekSlice.ts` |
| **monthSlice** | 월간 계획 | 🗓️ 월간 달력 | `store/slices/monthSlice.ts` |
| **uiSlice** | 화면 상태 | 📺 현재 TV 채널 (어떤 화면을 보고 있는지) | `store/slices/uiSlice.ts` |

---

## 🔄 2. 데이터 흐름 (어떻게 작동하나요?)

### "Normalized Data" (정규화된 데이터)
도서관에서 책을 찾을 때, 책 내용 전체를 복사해서 다니지 않고 **청구기호(ID)**만 들고 다닙니다.

*   **프로젝트**는 "1월 계획 ID", "2월 계획 ID"만 가지고 있습니다.
*   **월간 계획**은 "1주차 ID", "2주차 ID"만 가지고 있습니다.
*   실제 내용은 각자 전용 서가(Slice)에 ID로 저장되어 있습니다.

> **에이전트에게 팁**: "데이터를 찾을 때는 ID를 타고 들어가서(Look up) 찾아야 한다"고 알려주세요.

---

## 🤖 3. 에이전트에게 작업 시킬 때 가이드

새로운 기능을 추가하거나 버그를 고칠 때, 에이전트에게 **"어디를 봐야 하는지"** 정확히 알려주면 작업 속도가 빨라집니다.

### 상황별 지시 가이드

#### Q. "새로운 버튼을 만들고 싶어요"
*   **지시**: "UI 컴포넌트는 `src/components/ui` 폴더를 참고해서 만들어줘. 기존 디자인 시스템(Card, Button 등)을 재사용해."
*   **관련 파일**: `src/components/ui/index.ts`

#### Q. "아이디어 추가 기능을 고치고 싶어요"
*   **지시**: "아이디어 로직은 `features/ideas/useIdeaHandlers.ts`에 있어. 상태 변경은 `store/slices/ideaSlice.ts`를 확인해."
*   **관련 파일**: `src/features/ideas/useIdeaHandlers.ts`, `src/store/slices/ideaSlice.ts`

#### Q. "타이머가 이상해요"
*   **지시**: "타이머 로직은 `features/timer/useTimer.ts`에 독립적으로 분리되어 있어. 거기를 확인해봐."
*   **관련 파일**: `src/features/timer/useTimer.ts`

#### Q. "전체적인 앱 흐름을 바꾸고 싶어요"
*   **지시**: "메인 로직은 `App.tsx`에 있지만, 세부 로직은 다 `features/` 폴더로 빠져 있어. `App.tsx`는 조립만 하는 곳이야."
*   **관련 파일**: `src/App.tsx`, `src/features/`

---

## 🗂️ 4. 폴더 구조 요약 (지도)

```
src/
├── components/          # 🧱 벽돌 (화면 조각들)
│   ├── ui/              #    → 공통 벽돌 (버튼, 카드 등)
│   └── views/           #    → 완성된 방 (메인 화면, 대시보드 등)
├── features/            # 🧠 뇌 (비즈니스 로직)
│   ├── ideas/           #    → 아이디어 생각
│   ├── projects/        #    → 프로젝트 관리 능력
│   └── timer/           #    → 시간 관리 능력
├── store/               # 💾 기억 (데이터 저장소)
│   └── slices/          #    → 기억의 방 (주제별로 나뉨)
├── constants/           # 📌 규칙 (변하지 않는 값들)
└── hooks/               # 🎣 도구 (편의 기능)
```

---

## ✅ 5. 체크리스트 (작업 승인 전 확인)

에이전트가 작업을 마쳤을 때 다음을 확인하세요:

1.  **파일 크기**: 한 파일이 너무 커지지 않았나요? (보통 300줄 넘으면 분리 권장)
2.  **재사용**: 이미 있는 `components/ui`를 사용했나요? (새로 만들지 말고)
3.  **위치**: 로직은 `features/`에, 상태는 `store/`에 넣었나요? (`App.tsx`에 쑤셔넣지 않았는지 확인)

이 가이드를 통해 여러 에이전트와 효율적으로 협업하여 SchemeLand를 발전시켜 나가세요! 🚀

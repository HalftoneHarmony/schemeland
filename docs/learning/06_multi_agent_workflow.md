# 멀티 에이전트 워크플로우(Multi-Agent Workflow) 가이드

혼자서 AI 하나(Antigravity 등)와 작업하는 것을 넘어, 여러 AI 도구(Warp, Claude Code, Cursor 등)를 동시에 사용하여 **병렬(Parallel)**로 작업 속도를 극대화하는 방법을 설명합니다.

이 단계에서 당신의 역할은 '코더(Coder)'에서 **'엔지니어링 매니저(Engineering Manager)'**로 바뀝니다.

---

## 1. 기본 개념: 주방 비유 (The Kitchen Analogy)

지금까지의 방식이 **"당신과 보조 요리사 1명이 요리 하나를 처음부터 끝까지 같이 만드는 것"**이었다면,
멀티 에이전트 방식은 **"당신이 헤드 셰프(Head Chef)가 되어 여러 명의 요리사에게 동시에 다른 지시를 내리는 것"**입니다.

*   **Main (Master) 브랜치**: 손님에게 나가는 **완성된 요리 접시**입니다. 여기는 항상 깨끗하고 완벽해야 합니다.
*   **Feature (Topic) 브랜치**: 요리사들이 각자 작업하는 **개별 도마**입니다.
    *   요리사 A (브랜치 A): 양파를 썹니다. (UI 작업)
    *   요리사 B (브랜치 B): 고기를 굽습니다. (DB 작업)
*   **Merge (병합)**: 개별 도마에서 손질된 재료를 냄비(Main)에 합치는 과정입니다.

---

## 2. 실전 워크플로우 (Step-by-Step)

이 작업을 하기 위해서는 **Git 브랜치(Branch)** 개념이 필수입니다.

### 1단계: 작업 분할 (Ticket Creation)
가장 중요한 단계입니다. AI들에게 일을 동시다발적으로 시키려면, 일이 서로 겹치지 않게 잘게 쪼개야 합니다.

*   **나쁜 예**: "SchemeLand 앱 전체를 만들어줘." (모든 AI가 같은 파일을 건드려서 충돌남)
*   **좋은 예**:
    *   임무 1: "로그인 페이지 UI만 만들어."
    *   임무 2: "데이터베이스 스키마만 짜줘."
    *   임무 3: "로고 이미지만 디자인해."

### 2단계: 브랜치 생성 (Create Parallel Universes)
각 작업마다 별도의 '작업 공간(Branch)'을 만듭니다. 터미널(Warp 등)에서 명령어를 입력합니다.

*   **터미널 창 1 (UI 작업용)**:
    ```bash
    git checkout main       # 메인으로 이동
    git pull                # 최신 상태 업데이트
    git checkout -b feat/login-ui  # 'feat/login-ui'라는 새 브랜치(도마) 생성
    # 이후 Cursor나 Claude Code에게 UI 작업을 시킴
    ```

*   **터미널 창 2 (DB 작업용)**:
    ```bash
    git checkout main       # 다시 메인으로 이동 (UI 작업 내역이 없는 깨끗한 상태)
    git checkout -b feat/database  # 'feat/database'라는 새 브랜치 생성
    # 이후 다른 AI 에이전트에게 DB 작업을 시킴
    ```

### 3단계: 병렬 작업 및 커밋 (Parallel Execution)
이제 두 개의 평행 우주가 생겼습니다.
*   **우주 A**: 로그인 화면은 있는데 DB 코드는 없음.
*   **우주 B**: DB 코드는 있는데 로그인 화면은 없음.

각 우주에서 작업이 끝나면 가볍게 저장(`commit`)합니다.

### 4단계: 합병 (Merge)
헤드 셰프(당신)가 각 도마의 결과물을 검사하고 합칩니다.

1.  **메인으로 복귀**: `git checkout main`
2.  **UI 작업 합치기**: `git merge feat/login-ui` (이제 메인에 UI가 생김)
3.  **DB 작업 합치기**: `git merge feat/database` (이제 메인에 UI + DB가 모두 생김)

---

## 3. 충돌(Conflict) 해결: "둘이 같은 걸 건드렸어요!"

가끔 요리사 A와 B가 **똑같은 파일의 똑같은 줄**을 수정할 때가 있습니다. 이를 **충돌(Conflict)**이라고 합니다.
Git은 똑똑하게도 "이 부분에서 A는 이렇게 썼고 B는 저렇게 썼는데, 님(Manager)이 결정해주세요"라고 알려줍니다.

이때는 당황하지 말고, 코드를 보고 둘 중 하나를 선택하거나 둘 다 살리도록 수정한 뒤 다시 `commit`하면 됩니다.

---

## 4. 요약 시나리오

1.  **기획**: "오늘 할 일은 '버튼 디자인 변경'과 '새 기능 추가'야."
2.  **세팅**: 터미널 탭 2개를 엽니다.
    *   탭 1 (Claude Code): `git checkout -b visual-update` -> "버튼 색깔 바꿔줘."
    *   탭 2 (Cursor): `git checkout -b new-logic` -> "계산 로직 추가해줘."
3.  **작업**: 두 AI가 각자 미친 듯이 코딩합니다.
4.  **취합**: 작업이 끝나면 순서대로 `main`에 합칩니다.
    *   `git checkout main` -> `git merge visual-update` -> `git merge new-logic`
5.  **완성**: `SchemeLand`가 두 가지 기능이 모두 업데이트된 상태가 됩니다.

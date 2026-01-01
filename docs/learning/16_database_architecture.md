# 16. 데이터베이스 아키텍처 이해하기

> 🎯 **학습 목표**: 앱의 데이터가 어떻게 저장되고 관리되는지 이해하고, 좋은 데이터 구조가 왜 중요한지 배웁니다.

---

## 1. 데이터베이스란?

### 일상적인 비유
- **서류철 시스템**: 회사에서 문서를 분류해서 보관하는 것처럼, 앱도 데이터를 체계적으로 저장합니다.
- **도서관 시스템**: 책(데이터)을 분류 번호(ID)로 관리하고, 목록(인덱스)으로 빠르게 찾습니다.

### 웹 앱에서의 데이터 저장 방식

| 저장 방식 | 설명 | 비유 |
|-----------|------|------|
| **localStorage** | 브라우저에 저장, 새로고침해도 유지 | 개인 메모장 |
| **sessionStorage** | 탭을 닫으면 삭제 | 임시 포스트잇 |
| **IndexedDB** | 브라우저 내 대용량 DB | 개인용 파일 캐비닛 |
| **서버 DB** | 원격 서버에 저장 | 클라우드 창고 |

> 💡 **SchemeLand**는 현재 `localStorage`를 사용합니다.

---

## 2. SchemeLand의 현재 데이터 구조

### 저장되는 데이터 종류

```
🗂️ schemeland_projects (프로젝트 목록)
    └── 📁 각 프로젝트
        ├── 📄 selectedIdea (선택한 아이디어)
        ├── 📄 analysis (AI 분석 결과)
        ├── 📄 yearlyPlan (연간 계획)
        ├── 📄 threeYearVision (3년 비전)
        └── 📁 monthlyPlan (월별 계획)
            └── 📁 detailedPlan (주간 계획)
                └── 📄 tasks (할 일 목록)

🗂️ schemeland_ideas (아이디어 목록)
🗂️ schemeland_analyses (분석 결과 목록)
🗂️ schemeland_view (현재 화면)
🗂️ schemeland_active_id (활성 프로젝트 ID)
```

### 실제 데이터 예시

```javascript
// 하나의 프로젝트 데이터
{
  id: "abc-123",
  selectedIdea: {
    id: "idea-001",
    title: "AI 영어 튜터 앱",
    description: "대화형 AI로 영어 연습"
  },
  monthlyPlan: [
    {
      month: 1,
      theme: "기초 설계",
      detailedPlan: [
        {
          weekNumber: 1,
          theme: "시장 조사",
          tasks: [
            { id: "task-001", text: "경쟁 앱 분석", isCompleted: false }
          ]
        }
      ]
    }
  ]
}
```

---

## 3. 데이터 구조의 문제점 이해하기

### 📌 문제 1: 데이터 중복 (Data Duplication)

**현재 상황:**
```
아이디어 "AI 영어 튜터"
  ↓ 복사됨
schemeland_ideas 배열에도 있고
  ↓ 또 복사됨
프로젝트.selectedIdea에도 있음
```

**문제점:**
- 아이디어 제목을 수정하면 두 곳 모두 바꿔야 함
- 하나만 바꾸면 데이터 불일치 발생
- 저장 공간 낭비

**비유:**
> 연락처를 수첩에도 적고, 휴대폰에도 저장했는데, 전화번호가 바뀌면 둘 다 수정해야 하는 것과 같습니다.

### 📌 문제 2: 깊은 중첩 구조 (Deep Nesting)

**현재 구조:**
```
projects → monthlyPlan → detailedPlan → week → tasks → task
(1단계)     (2단계)        (3단계)      (4단계) (5단계) (6단계)
```

**문제점:**
- Task 하나를 수정하려면 5단계를 거쳐야 함
- 코드가 복잡해짐
- 실수할 가능성 증가

**비유:**
> 러시아 인형(마트료시카)처럼 인형 안의 인형 안의 인형... 가장 안쪽 인형을 꺼내려면 모든 인형을 열어야 합니다.

### 📌 문제 3: 비효율적인 검색 (O(n) Lookup)

**현재 방식:**
```javascript
// 프로젝트 찾기
projects.find(p => p.id === "abc-123")
```

**문제점:**
- 프로젝트가 100개면 최대 100번 비교해야 함
- 프로젝트가 늘어날수록 느려짐

**비유:**
> 책을 찾으려고 도서관의 모든 책장을 하나씩 확인하는 것과 같습니다. 도서 번호(인덱스)로 바로 찾으면 훨씬 빠릅니다.

---

## 4. 개선된 데이터 구조 이해하기

### 정규화 (Normalization)

**개념:**
데이터를 **중복 없이** **독립적인 테이블**로 분리하고, **ID로 연결**하는 방식

**비유:**
- **Before**: 주소록에 친구 정보와 그 친구가 다니는 회사 정보를 함께 적음
- **After**: 친구 목록과 회사 목록을 따로 만들고, 친구에게 "회사ID: 5번" 형태로 연결

**개선된 구조:**
```javascript
// 각 데이터를 독립적으로 저장
const tasks = {
  "task-001": { text: "경쟁 앱 분석", status: "TODO" },
  "task-002": { text: "UI 스케치", status: "DONE" }
};

// ID로 빠르게 접근 - O(1)
const myTask = tasks["task-001"]; // 바로 찾음!
```

### Record 구조의 장점

| 기존 (Array) | 개선 (Record) |
|--------------|---------------|
| `tasks: Task[]` | `tasks: Record<string, Task>` |
| 찾기: O(n) | 찾기: O(1) |
| `find()` 필요 | 바로 접근 |

**O(n) vs O(1) 설명:**
- **O(n)**: n개 중에 하나 찾으려면 최대 n번 확인 (느림)
- **O(1)**: 몇 개든 항상 1번에 찾음 (빠름)

---

## 5. 상태 관리 라이브러리

### 현재 방식: useState + useLocalStorage

```javascript
// 여러 곳에 흩어진 상태
const [ideas, setIdeas] = useLocalStorage('ideas', []);
const [projects, setProjects] = useLocalStorage('projects', []);
const [analyses, setAnalyses] = useLocalStorage('analyses', []);
// ... 더 많은 상태들
```

**문제점:**
- 상태가 여러 곳에 분산
- 동기화하기 어려움
- 디버깅 어려움

### 개선 방식: Zustand

```javascript
// 한 곳에서 모든 상태 관리
const useStore = create((set) => ({
  projects: {},
  tasks: {},
  
  // 액션도 함께 정의
  addTask: (task) => set((state) => ({
    tasks: { ...state.tasks, [task.id]: task }
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: { 
      ...state.tasks, 
      [id]: { ...state.tasks[id], ...updates } 
    }
  }))
}));
```

**장점:**
- 모든 데이터가 한 곳에
- 자동으로 localStorage 동기화 가능
- 개발자 도구로 상태 확인 가능

---

## 6. 마이그레이션이란?

### 개념
기존 데이터 구조를 새로운 구조로 **안전하게 변환**하는 과정

### 비유
> 이사할 때 짐을 새 집에 맞게 정리하는 것과 같습니다. 기존 물건(데이터)을 버리지 않고, 새 집(새 구조)에 맞게 재배치합니다.

### 마이그레이션 단계

```
1. 새 구조 정의
2. 변환 함수 작성
3. 기존 데이터 읽기
4. 새 구조로 변환
5. 새 데이터 저장
6. 검증
```

### 예시 코드

```javascript
function migrateData(oldData) {
  // 기존: 배열
  // oldData.projects = [{ id: "1", ... }, { id: "2", ... }]
  
  // 새로운: Record
  const newProjects = {};
  
  oldData.projects.forEach(project => {
    newProjects[project.id] = project;
  });
  
  return { ...oldData, projects: newProjects };
}
```

---

## 7. 핵심 용어 정리

| 용어 | 영어 | 설명 |
|------|------|------|
| 정규화 | Normalization | 중복 제거하고 독립적 테이블로 분리 |
| 스키마 | Schema | 데이터의 구조 정의 (설계도) |
| 엔티티 | Entity | 저장되는 데이터 단위 (예: Project, Task) |
| 관계 | Relation | 엔티티 간의 연결 (예: Project → Tasks) |
| 마이그레이션 | Migration | 데이터 구조 변환 작업 |
| O(1) | Constant Time | 데이터 양과 무관하게 일정한 시간 |
| O(n) | Linear Time | 데이터 양에 비례하는 시간 |

---

## 8. 왜 이런 개선이 필요한가?

### 현재 문제가 실제로 미치는 영향

1. **속도**: 프로젝트가 많아지면 앱이 느려짐
2. **버그**: 데이터 불일치로 예상치 못한 오류 발생
3. **유지보수**: 코드 수정이 어려워짐
4. **확장성**: 새 기능 추가 시 복잡도 급증

### 개선 후 기대 효과

1. **빠른 성능**: 어떤 데이터든 즉시 접근
2. **데이터 일관성**: 하나만 수정하면 전체 반영
3. **깔끔한 코드**: 5단계 중첩 → 직접 접근
4. **쉬운 확장**: 새 기능 추가가 용이

---

## 9. 실습: 현재 데이터 확인하기

브라우저 개발자 도구에서 현재 저장된 데이터를 확인해보세요:

1. **Chrome DevTools 열기**: `F12` 또는 `Cmd+Option+I`
2. **Application 탭** 클릭
3. **Local Storage** → `localhost:3000` 선택
4. `schemeland_projects` 등의 키 확인

```javascript
// Console에서 실행
JSON.parse(localStorage.getItem('schemeland_projects'))
```

---

## 📚 더 알아보기

- [localStorage MDN 문서](https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage)
- [데이터 정규화란?](https://ko.wikipedia.org/wiki/데이터베이스_정규화)
- [Zustand 공식 문서](https://zustand-demo.pmnd.rs/)

---

> 💡 **다음 단계**: 이 문서에서 배운 개념들이 실제로 어떻게 코드로 구현되는지 `feature/database-refactor` 브랜치에서 확인해보세요!

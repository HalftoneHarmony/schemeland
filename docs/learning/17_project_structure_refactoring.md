# 17. 프로젝트 구조 리팩토링 학습 노트

> 🎯 **학습 목표**: 대규모 React 프로젝트를 어떻게 모듈화하고 유지보수하기 쉽게 구조화하는지 이해합니다.

---

## 1. 리팩토링이란?

### 정의
코드의 **외부 동작을 변경하지 않으면서** 내부 구조를 개선하는 작업

### 비유
> 집 안의 가구를 재배치하는 것과 같습니다. 집의 기능(살 수 있다)은 그대로지만, 더 편리하게 사용할 수 있게 됩니다.

### 왜 필요한가?
| 문제 | 해결 |
|------|------|
| 파일이 너무 길다 (800줄+) | 기능별로 분리 |
| 같은 코드가 여러 곳에 반복 | 공통 컴포넌트/훅 추출 |
| 하나를 고치면 다른 곳이 망가짐 | 관심사 분리 (SoC) |
| 팀원이 코드를 이해하기 어려움 | 명확한 폴더 구조 |

---

## 2. 슬라이스 패턴 (Slice Pattern)

### 개념
상태 관리 로직을 **도메인별로 분리**하는 패턴

### Before: 하나의 거대한 스토어 (923줄)
```javascript
// store/index.ts - 모든 것이 하나의 파일에!
const useStore = create((set, get) => ({
    // Ideas 관련 (100줄)
    ideas: {},
    addIdea: () => {...},
    updateIdea: () => {...},
    deleteIdea: () => {...},
    
    // Projects 관련 (200줄)
    projects: {},
    createProject: () => {...},
    deleteProject: () => {...},
    
    // Tasks 관련 (150줄)
    tasks: {},
    addTask: () => {...},
    updateTask: () => {...},
    
    // ... 수백 줄 더
}));
```

### After: 슬라이스로 분리
```
src/store/
├── index.ts           # 통합 스토어 (~300줄)
├── slices/
│   ├── ideaSlice.ts   # 아이디어 관련 (~90줄)
│   ├── taskSlice.ts   # 태스크 관련 (~150줄)
│   ├── weekSlice.ts   # 주간 관련 (~90줄)
│   ├── monthSlice.ts  # 월간 관련 (~130줄)
│   ├── projectSlice.ts# 프로젝트 관련 (~280줄)
│   └── uiSlice.ts     # UI 상태 관련 (~60줄)
├── migration.ts
└── storage.ts
```

### 각 슬라이스의 구조
```typescript
// slices/ideaSlice.ts

// 1. 상태 타입 정의
interface IdeaState {
    ideas: Record<string, ProjectIdea>;
}

// 2. 액션 타입 정의
interface IdeaActions {
    addIdea: (data) => ProjectIdea;
    updateIdea: (id, updates) => void;
    deleteIdea: (id) => void;
}

// 3. 초기 상태
const initialIdeaState = { ideas: {} };

// 4. 슬라이스 생성자
const createIdeaSlice = (set, get) => ({
    ...initialIdeaState,
    addIdea: (data) => { /* 로직 */ },
    updateIdea: (id, updates) => { /* 로직 */ },
    deleteIdea: (id) => { /* 로직 */ },
});
```

### 장점
1. **관심사 분리**: 각 슬라이스는 하나의 도메인만 담당
2. **찾기 쉬움**: `addTask`를 찾으려면 `taskSlice.ts`만 보면 됨
3. **테스트 용이**: 각 슬라이스를 독립적으로 테스트 가능
4. **충돌 감소**: 여러 사람이 다른 슬라이스 작업 가능

---

## 3. 커스텀 훅 패턴 (Features)

### 개념
관련된 상태와 로직을 **하나의 훅으로 묶는** 패턴

### Before: App.tsx에 모든 핸들러
```javascript
function App() {
    // 아이디어 관련 상태
    const [isRefining, setIsRefining] = useState({});
    const [isSuggesting, setIsSuggesting] = useState(false);
    
    // 아이디어 관련 핸들러 (50줄)
    const handleAddIdea = () => {...};
    const handleUpdateIdea = () => {...};
    const handleMagicRefine = async () => {...};
    const handleSuggestIdeas = async () => {...};
    
    // 타이머 관련 상태 (20줄)
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    
    // 타이머 관련 로직 (40줄)
    useEffect(() => {...}, [timerActive, timeLeft]);
    
    // 프로젝트 관련 핸들러 (100줄)
    // ...
    
    // 총 800줄 이상!
}
```

### After: 기능별 훅 분리
```
src/features/
├── ideas/
│   ├── useIdeaHandlers.ts   # 아이디어 핸들러
│   └── index.ts
├── timer/
│   ├── useTimer.ts          # 포모도로 타이머
│   └── index.ts
├── projects/
│   ├── useProjectHandlers.ts # 프로젝트 핸들러
│   └── index.ts
└── index.ts                  # 통합 내보내기
```

### 사용 예시
```typescript
// features/timer/useTimer.ts
export function useTimer() {
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [timerMode, setTimerMode] = useState('FOCUS');
    
    useEffect(() => {
        // 타이머 로직...
    }, [timerActive, timeLeft]);
    
    return {
        timerActive,
        timeLeft,
        timerMode,
        toggleTimer: () => setTimerActive(prev => !prev),
        resetTimer: () => { /* ... */ },
    };
}

// App.tsx에서 사용
function App() {
    const timer = useTimer();
    // timer.timerActive, timer.toggleTimer() 등 사용
}
```

---

## 4. 공통 UI 컴포넌트 (Design System)

### 개념
자주 사용하는 UI 요소를 **재사용 가능한 컴포넌트**로 만들기

### 생성된 컴포넌트들
```
src/components/ui/
├── Card.tsx          # 카드 컴포넌트
├── Modal.tsx         # 모달 컴포넌트
├── Badge.tsx         # 배지 컴포넌트
├── Input.tsx         # 입력 컴포넌트
├── LoadingSpinner.tsx # 로딩 스피너
├── ProgressBar.tsx   # 진행률 바
└── index.ts          # 통합 내보내기
```

### 컴포넌트 설계 원칙

#### 1. Props를 통한 커스터마이징
```tsx
// variant로 스타일 변형
<Card variant="cyber" />
<Card variant="glass" />

// size로 크기 조절
<Badge size="sm" />
<Badge size="lg" />
```

#### 2. 기본값 제공
```tsx
function Card({
    variant = 'default',  // 기본값
    padding = 'md',       // 기본값
}) { ... }
```

#### 3. 확장 가능한 className
```tsx
<Card className="my-4" />  // 추가 스타일 적용 가능
```

### 사용 예시
```tsx
import { Card, Badge, ProgressBar } from '@/components/ui';

function ProjectCard({ project }) {
    return (
        <Card variant="cyber" hoverable>
            <Badge variant="success">진행중</Badge>
            <h3>{project.name}</h3>
            <ProgressBar value={75} variant="gradient" />
        </Card>
    );
}
```

---

## 5. 상수 분리 (Constants)

### 개념
**하드코딩된 값**을 별도 파일로 분리

### Before: 컴포넌트 내 하드코딩
```javascript
function App() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);  // 25분
    // ...
    setTimeLeft(5 * 60);   // 5분 휴식
    setTimeLeft(20 * 60);  // 20분 긴 휴식
}
```

### After: 상수 파일 분리
```typescript
// constants/timer.ts
export const TIMER_DURATIONS = {
    FOCUS: 25 * 60,        // 25분
    SHORT_BREAK: 5 * 60,   // 5분
    LONG_BREAK: 20 * 60,   // 20분
} as const;

// 사용
import { TIMER_DURATIONS } from '@/constants';
setTimeLeft(TIMER_DURATIONS.FOCUS);
```

### 장점
1. **변경 용이**: 한 곳만 수정하면 전체 적용
2. **가독성**: 숫자 대신 의미있는 이름
3. **오타 방지**: TypeScript 자동완성 활용

---

## 6. 폴더 구조 비교

### Before
```
src/
├── App.tsx              # 858줄 (너무 큼!)
├── components/
│   ├── Button.tsx
│   ├── IdeaCard.tsx
│   └── ...
├── hooks/
│   ├── useLocalStorage.ts
│   └── useProjectManager.ts
├── store/
│   └── index.ts         # 923줄 (너무 큼!)
└── types.ts
```

### After
```
src/
├── App.tsx              # 여전히 큼 (점진적 개선 필요)
├── components/
│   ├── ui/              # 🆕 공통 UI 컴포넌트
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   └── ...
│   └── ...
├── features/            # 🆕 기능별 핸들러 훅
│   ├── ideas/
│   ├── timer/
│   └── projects/
├── constants/           # 🆕 상수 정의
│   ├── app.ts
│   └── timer.ts
├── store/
│   ├── index.ts         # 간소화됨
│   └── slices/          # 🆕 도메인별 슬라이스
│       ├── ideaSlice.ts
│       ├── taskSlice.ts
│       └── ...
└── types.ts
```

---

## 7. 핵심 원칙 정리

### 1. 단일 책임 원칙 (SRP)
> 하나의 파일/함수/컴포넌트는 하나의 일만 한다

### 2. 관심사 분리 (SoC)
> 비슷한 것끼리 모으고, 다른 것은 분리한다

### 3. DRY (Don't Repeat Yourself)
> 중복을 피하고, 재사용 가능한 조각으로 만든다

### 4. 점진적 개선
> 한번에 다 바꾸지 않고, 조금씩 개선한다

---

## 8. 실습: 파일 크기 확인

리팩토링 전후 파일 크기를 비교해보세요:

```bash
# 터미널에서 실행
wc -l src/store/index.ts
wc -l src/store/slices/*.ts
```

---

## 📚 용어 정리

| 용어 | 영어 | 설명 |
|------|------|------|
| 리팩토링 | Refactoring | 동작 변경 없이 구조 개선 |
| 슬라이스 | Slice | 도메인별로 분리된 상태 조각 |
| 커스텀 훅 | Custom Hook | 재사용 가능한 React 로직 |
| 디자인 시스템 | Design System | 재사용 가능한 UI 컴포넌트 모음 |
| 관심사 분리 | Separation of Concerns | 다른 기능은 다른 곳에 |
| 단일 책임 | Single Responsibility | 하나의 것은 하나의 일만 |

---

> 💡 **다음 단계**: 생성된 커스텀 훅과 UI 컴포넌트를 실제로 App.tsx에서 import해서 사용해보세요!

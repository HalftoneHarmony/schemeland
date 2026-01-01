import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProjectIdea, IdeaAnalysis, ProjectScheme, WeeklyMilestone, Difficulty, ThreeYearVision, MonthlyGoal, WeeklyPlanOption } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const analysisSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      ideaId: { type: Type.STRING, description: "The exact ID provided in the prompt for this idea." },
      metrics: {
        type: Type.OBJECT,
        properties: {
          feasibility: { type: Type.INTEGER, description: "Technical/Realistic feasibility score 0-100" },
          marketPotential: { type: Type.INTEGER, description: "Profit/Growth potential score 0-100" },
          excitement: { type: Type.INTEGER, description: "Subjective fun/passion score 0-100" },
          speedToMVP: { type: Type.INTEGER, description: "Speed to launch MVP score 0-100" },
        },
        required: ["feasibility", "marketPotential", "excitement", "speedToMVP"]
      },
      reasoning: { type: Type.STRING, description: "Detailed Korean analysis of why this idea is good or bad." },
      oneLiner: { type: Type.STRING, description: "A vivid realization (R=VD) tagline in Korean." }
    },
    required: ["ideaId", "metrics", "reasoning", "oneLiner"]
  }
};

const fullPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    yearlyPlan: {
      type: Type.OBJECT,
      properties: {
        vision: { type: Type.STRING, description: "1-Year R=VD vivid vision statement in Korean" },
        keyResults: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 SMART annual goals" }
      },
      required: ["vision", "keyResults"]
    },
    monthlyPlan: {
      type: Type.ARRAY,
      description: "6-Month high level roadmap",
      items: {
        type: Type.OBJECT,
        properties: {
          month: { type: Type.INTEGER },
          theme: { type: Type.STRING, description: "Theme for the month" },
          goals: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key milestones for this month" }
        },
        required: ["month", "theme", "goals"]
      }
    },
    weeklyPlan: {
      type: Type.ARRAY,
      description: "4-Week detailed action plan for Month 1",
      items: {
        type: Type.OBJECT,
        properties: {
          weekNumber: { type: Type.INTEGER },
          theme: { type: Type.STRING, description: "Main focus of the week using 3P (Positive, Present, Personal) format in Korean" },
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING, description: "SMART Actionable task item in Korean" },
                isCompleted: { type: Type.BOOLEAN }
              },
              required: ["id", "text", "isCompleted"]
            }
          }
        },
        required: ["weekNumber", "theme", "tasks"]
      }
    }
  },
  required: ["yearlyPlan", "monthlyPlan", "weeklyPlan"]
};

const refineSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy, professional startup name (Korean or English)" },
    description: { type: Type.STRING, description: "A compelling elevator pitch describing Problem, Solution, and Target in Korean." },
    emoji: { type: Type.STRING, description: "A single representative emoji for this project." }
  },
  required: ["title", "description", "emoji"]
};

const suggestionSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      emoji: { type: Type.STRING }
    },
    required: ["title", "description", "emoji"]
  }
};

const weeklyAdjustSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      weekNumber: { type: Type.INTEGER },
      theme: { type: Type.STRING },
      tasks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            text: { type: Type.STRING },
            isCompleted: { type: Type.BOOLEAN }
          },
          required: ["id", "text", "isCompleted"]
        }
      }
    },
    required: ["weekNumber", "theme", "tasks"]
  }
};

const yearPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    vision: { type: Type.STRING, description: "Vivid vision statement for the year in Korean" },
    keyResults: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 SMART milestones for this year" }
  },
  required: ["vision", "keyResults"]
};

const threeYearSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    year1: yearPlanSchema,
    year2: yearPlanSchema,
    year3: yearPlanSchema,
    ultimateGoal: { type: Type.STRING, description: "The ultimate R=VD north star" }
  },
  required: ["year1", "year2", "year3", "ultimateGoal"]
};

const planOptionsSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      strategyName: { type: Type.STRING, description: "Name of the strategy (e.g., 'Aggressive Sprint', 'Quality First')" },
      description: { type: Type.STRING, description: "Short explanation of this approach and its trade-offs" },
      plan: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            weekNumber: { type: Type.INTEGER },
            theme: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  isCompleted: { type: Type.BOOLEAN }
                },
                required: ["id", "text", "isCompleted"]
              }
            }
          },
          required: ["weekNumber", "theme", "tasks"]
        }
      }
    },
    required: ["strategyName", "description", "plan"]
  }
};

const monthlyListSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      month: { type: Type.INTEGER },
      theme: { type: Type.STRING, description: "Theme for the month" },
      goals: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key milestones for this month" }
    },
    required: ["month", "theme", "goals"]
  }
};

// ... [Previous functions remain identical] ...
export const analyzeIdeas = async (ideas: ProjectIdea[]): Promise<IdeaAnalysis[]> => {
  const prompt = `
    당신은 냉철한 스타트업 코치이자 프로덕트 매니저입니다.
    사용자가 여러 사이드 프로젝트 아이디어 중 하나를 선택하려고 합니다.
    R=VD (생생하게 꿈꾸면 이루어진다) 기법과 현실적인 비즈니스 분석을 통해 평가해주세요.

    다음은 사용자의 아이디어 목록입니다:
    ${JSON.stringify(ideas.map(i => ({ id: i.id, title: i.title, description: i.description })))}

    각 아이디어를 다음 4가지 기준으로 0~100점 사이로 평가하고, JSON 배열로 반환하세요.
    
    1. Feasibility (실현 가능성): 기술적으로 구현 가능한가? 현실적인가?
    2. Market Potential (시장성): 돈이 되거나 유저를 모을 수 있는가?
    3. Excitement (흥미도): 지속적으로 몰입할 만큼 재미있는가?
    4. SpeedToMVP (속도): 1달 안에 MVP가 나올 수 있는가?

    **Reasoning (분석평)**: 한국어로 작성. 냉정하고 직설적으로 장단점을 지적하세요.
    **OneLiner (한줄 요약)**: 이 프로젝트가 성공했을 때의 모습을 생생하게 그릴 수 있는(R=VD) 문장으로 작성하세요.

    반드시 정의된 JSON 스키마를 따르세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as IdeaAnalysis[];
    }
    throw new Error("No data returned from Gemini");
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const generateFullPlan = async (idea: ProjectIdea, context: string): Promise<any> => {
  const prompt = `
    사용자가 프로젝트 "${idea.title}"를 시작하기로 확정했습니다.
    설명: ${idea.description}.
    분석 배경: ${context}

    이 프로젝트의 장기적인 성공을 위해 연간(Yearly), 월간(Monthly), 주간(Weekly) 목표를 수립해주세요.
    
    **1. 연간 목표 (Yearly Plan)**:
    - 1년 후의 모습을 상상하는 R=VD 비전.
    - 1년 안에 달성할 3가지 핵심 목표 (Key Results).

    **2. 월간 로드맵 (Monthly Plan - 6개월치)**:
    - Month 1: MVP 개발 및 출시 (필수).
    - Month 2~6: 성장, 마케팅, 수익화 등 단계별 테마와 핵심 목표 설정.

    **3. 주간 실행 계획 (Weekly Plan - Month 1 상세)**:
    - Month 1을 성공시키기 위한 4주간의 구체적인 SMART 실행 계획.
    - 각 주차별 3P (Positive, Present, Personal) 테마 설정.

    모든 내용은 한국어로 작성하고 JSON 포맷을 준수하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: fullPlanSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No plan returned from Gemini");
  } catch (error) {
    console.error("Full plan generation failed:", error);
    throw error;
  }
};

export const refineIdea = async (draft: string): Promise<{ title: string, description: string, emoji: string }> => {
  const prompt = `
    사용자가 대략적으로 적은 사이드 프로젝트 아이디어를 구체화(Refine)해주세요.
    입력값: "${draft}"
    
    1. **Title**: 이목을 끄는 멋진 스타트업 서비스 이름 (한국어 또는 영어).
    2. **Description**: SMART(구체적) 기법을 사용하여, 이 서비스가 해결하는 문제(Problem), 해결책(Solution), 타겟 유저(Target)를 명확하고 매력적으로 한국어로 기술하세요. 2~3문장 내외.
    3. **Emoji**: 이 프로젝트를 가장 잘 나타내는 이모지 하나를 선택해주세요.

    JSON 포맷으로 반환하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: refineSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as { title: string, description: string, emoji: string };
    }
    throw new Error("No refinement returned");
  } catch (error) {
    console.error("Refine failed", error);
    throw error;
  }
};

export const suggestIdeas = async (): Promise<{ title: string, description: string, emoji: string }[]> => {
  const prompt = `
    1인 개발자(Indie Hacker)가 지금 당장 시작해볼 만한 트렌디하고 수익성 있는 사이드 프로젝트 아이디어 3개를 제안해주세요.
    분야: SaaS, Micro-SaaS, AI Tools, 생산성 도구 등.
    
    각 아이디어는 다음을 포함해야 합니다:
    1. Title: 매력적인 이름
    2. Description: 구체적인 아이디어 설명 (한국어)
    3. Emoji: 아이디어를 대표하는 이모지

    JSON 배열로 반환하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: suggestionSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as { title: string, description: string, emoji: string }[];
    }
    throw new Error("No suggestions returned");
  } catch (error) {
    console.error("Suggest failed", error);
    throw error;
  }
};

export const adjustWeeklyPlan = async (
  currentIdea: ProjectIdea,
  newGoal: string,
  difficulty: Difficulty
): Promise<WeeklyMilestone[]> => {
  const difficultyPrompt =
    difficulty === Difficulty.EASY ? "여유롭게 진행 (직장인/학생 병행)" :
      difficulty === Difficulty.HARD ? "하드코어/해커톤 모드 (단기간 집중)" :
        "일반적인 스타트업 속도";

  const prompt = `
    사용자가 Month 1의 목표를 수정했습니다.
    새로운 목표: "${newGoal}"
    설정된 난이도: ${difficultyPrompt}
    프로젝트: ${currentIdea.title} - ${currentIdea.description}

    이 새로운 목표와 난이도에 맞춰 Month 1 (4주차)의 주간 실행 계획(Weekly Plan)을 다시 작성해주세요.
    
    규칙:
    1. 난이도가 'HARD'라면 태스크 양을 늘리고 기간을 단축하세요.
    2. 난이도가 'EASY'라면 핵심 기능에만 집중하고 여유를 두세요.
    3. SMART 및 3P 기법을 유지하세요.
    
    JSON 포맷을 준수하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: weeklyAdjustSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as WeeklyMilestone[];
    }
    throw new Error("Plan adjustment failed");
  } catch (error) {
    console.error("Adjust plan failed", error);
    throw error;
  }
};

export const expandToThreeYears = async (idea: ProjectIdea, currentVision: string): Promise<ThreeYearVision> => {
  const prompt = `
    사용자의 프로젝트 "${idea.title}"에 대해 더 장기적인 3년 비전을 수립해주세요.
    현재 1년 비전: ${currentVision}

    각 연도(Year 1, 2, 3)마다 다음을 포함해야 합니다:
    1. Vision: 해당 연도의 생생한 R=VD 비전 문장 (한국어)
    2. Key Results: 해당 연도에 달성할 SMART 마일스톤 3가지 (한국어 배열)

    비전 체계:
    - Year 1: 기반 다지기 및 생존
    - Year 2: 성장 및 스케일업
    - Year 3: 시장 지배 및 완성
    - Ultimate Goal: 최종적인 북극성(North Star)

    JSON을 반환하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: threeYearSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ThreeYearVision;
    }
    throw new Error("Vision expansion failed");
  } catch (error) {
    console.error("Expand vision failed", error);
    throw error;
  }
};

export const refineThreeYearVision = async (idea: ProjectIdea, draft: ThreeYearVision): Promise<ThreeYearVision> => {
  const prompt = `
      사용자의 프로젝트 "${idea.title}"에 대한 3년 비전 초안을 더 구체적이고 영감을 주는 R=VD(생생하게 꿈꾸면 이루어진다) 버전으로 발전시켜주세요.
      기존 비전보다 더 전략적이고 생생한 그림이 그려지도록 만들어야 합니다.

      각 연도별로 'vision' 문장은 더 가슴 벅차게, 'keyResults'는 더 구체적인 숫자가 들어간 SMART 목표로 다듬어주세요.

      사용자의 초안:
      - Year 1 Vision: ${draft.year1.vision}
      - Year 1 Milestones: ${draft.year1.keyResults.join(', ')}
      - Year 2 Vision: ${draft.year2.vision}
      - Year 2 Milestones: ${draft.year2.keyResults.join(', ')}
      - Year 3 Vision: ${draft.year3.vision}
      - Year 3 Milestones: ${draft.year3.keyResults.join(', ')}
      - Ultimate Goal: ${draft.ultimateGoal}

      한국어로 작성하고 JSON을 반환하세요.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: threeYearSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ThreeYearVision;
    }
    throw new Error("Vision refinement failed");
  } catch (error) {
    console.error("Refine vision failed", error);
    throw error;
  }
};

export const generateMonthPlanOptions = async (
  idea: ProjectIdea,
  monthGoal: MonthlyGoal
): Promise<WeeklyPlanOption[]> => {
  const prompt = `
    사용자가 프로젝트 "${idea.title}"의 Month ${monthGoal.month}에 대한 상세 주간 계획을 요청했습니다.
    이번 달 주제(Theme): ${monthGoal.theme}
    핵심 목표(Goals): ${monthGoal.goals.join(', ')}

    이 목표를 달성하기 위한 **3가지 서로 다른 실행 전략(Option)**을 제안해주세요.
    예를 들어:
    1. 공격적인 속도 중심 (Aggressive/Fast)
    2. 품질과 안정성 중심 (Quality/Steady)
    3. 실험과 피봇 중심 (Experimental/Flexible)
    
    각 옵션마다 구체적인 4주간(Week 1 ~ Week 4)의 실행 계획(Weekly Plan)을 포함해야 합니다.
    JSON 포맷을 준수하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: planOptionsSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as WeeklyPlanOption[];
    }
    throw new Error("Month detail generation failed");
  } catch (error) {
    console.error("Generate month detail failed", error);
    throw error;
  }
};

export const generateMonthDetails = async (idea: ProjectIdea, monthGoal: MonthlyGoal): Promise<WeeklyMilestone[]> => {
  const options = await generateMonthPlanOptions(idea, monthGoal);
  return options[0].plan; // Default to first option
};

export const extendRoadmap = async (idea: ProjectIdea, lastMonth: number): Promise<MonthlyGoal[]> => {
  const prompt = `
      현재 프로젝트 "${idea.title}"의 로드맵은 Month ${lastMonth}까지 작성되어 있습니다.
      Month ${lastMonth + 1}부터 Month ${lastMonth + 6}까지의 추가 로드맵(6개월)을 생성해주세요.
      
      장기적인 성장, 수익화 확장, 운영 안정화, 팀 빌딩 등 더 심화된 단계를 다뤄야 합니다.
      각 달의 month 숫자는 ${lastMonth + 1}부터 시작해야 합니다.
  
      JSON 배열 포맷을 준수하세요.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: monthlyListSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as MonthlyGoal[];
    }
    throw new Error("Roadmap extension failed");
  } catch (error) {
    console.error("Extend roadmap failed", error);
    throw error;
  }
};

export const compressRoadmap = async (idea: ProjectIdea, currentPlan: MonthlyGoal[], targetMonths: number): Promise<MonthlyGoal[]> => {
  const prompt = `
      사용자가 프로젝트 "${idea.title}"의 기존 ${currentPlan.length}개월 로드맵을 **${targetMonths}개월**로 압축하여 도전하려고 합니다.
      이것은 'Hardcore' 모드입니다. 난이도를 높이고, 불필요한 과정을 생략하고, 핵심 목표를 빠르게 달성하도록 재설계해주세요.
      
      기존 로드맵 내용: ${JSON.stringify(currentPlan.map(m => ({ m: m.month, t: m.theme })))}
  
      요구사항:
      1. 총 기간은 정확히 ${targetMonths}개월이어야 합니다 (Month 1 ~ Month ${targetMonths}).
      2. 기존의 핵심 마일스톤(MVP 출시, 마케팅, 수익화 등)은 모두 포함하되, 병렬 처리가 가능한 것은 합치세요.
      3. 각 달의 목표(Goals)는 더 도전적이고 많아야 합니다.
  
      JSON 배열 포맷을 준수하세요.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: monthlyListSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as MonthlyGoal[];
    }
    throw new Error("Roadmap compression failed");
  } catch (error) {
    console.error("Compress roadmap failed", error);
    throw error;
  }
};
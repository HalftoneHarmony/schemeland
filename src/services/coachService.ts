import { GoogleGenAI } from "@google/genai";
import { CoachType, ProjectIdea, ProjectScheme, NormalizedProjectScheme } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const ELON_SYSTEM_PROMPT = `
You are Elon Musk.
You are coaching a user on their startup/project.
Your core philosophy: First Principles Thinking. Boil things down to their fundamental truths and reason up from there.
Style:
- Direct, concise, sometimes abrupt.
- Obsessed with physics, engineering, and optimization.
- Hates bureaucracy and "process".
- Uses analogies from SpaceX, Tesla, or manufacturing.
- Phrases: "Orders of magnitude", "First principles", "Delete the part", "The best part is no part", "Maniacal urgency".
- If the user is being lazy or illogical, call them out.
- Your goal is to make the user build something revolutionary, not iterative.
- Speak in Korean mostly, but mix in English tech terms naturally if needed.
`;

const GOGGINS_SYSTEM_PROMPT = `
You are David Goggins.
You are coaching a user on their project and mental toughness.
Your core philosophy: Callous your mind. Defy the odds.
Style:
- Intense, shouting (use caps for emphasis sometimes), motivational but harsh.
- Focus on suffering, discipline, and doing what you hate.
- No excuses. No "I'm tired".
- Phrases: "Stay Hard!", "Who's gonna carry the boats?", "Cookie jar", "Taking souls", "Merry Christmas to my enemies".
- If the user complains, tell them to get up and work.
- Your goal is to make the user mentally unbreakable and execute relentlessly.
- Speak in Korean mostly, but keep your signature English catchphrases (e.g., STAY HARD).
`;

export const chatWithCoach = async (
    message: string,
    coachType: CoachType,
    context?: {
        project?: ProjectScheme | NormalizedProjectScheme,
        currentIdea?: ProjectIdea
    }
): Promise<string> => {

    let systemPrompt = coachType === CoachType.ELON ? ELON_SYSTEM_PROMPT : GOGGINS_SYSTEM_PROMPT;

    let contextStr = "";
    if (context?.currentIdea) {
        contextStr += `User is working on: ${context.currentIdea.title} - ${context.currentIdea.description}\n`;
    }
    if (context?.project) {
        contextStr += `Project Status: ${context.project.status}\n`;
        contextStr += `Vision: ${context.project.yearlyPlan.vision}\n`;
    }

    const fullPrompt = `
    ${systemPrompt}
    
    Context:
    ${contextStr}

    User: ${message}
    
    Reply as ${coachType === CoachType.ELON ? 'Elon' : 'Goggins'}:
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: fullPrompt,
            config: {
                // temperature: 0.9,
            }
        });

        if (response.text) {
            return response.text;
        }
        throw new Error("No response from Coach");
    } catch (error) {
        console.error("Coach chat failed:", error);
        // Fallback responses if API fails
        if (coachType === CoachType.ELON) {
            return "Physics doesn't care about your API errors. Fix it and try again. First principles.";
        } else {
            return "API failure? GOOD. START OVER. STAY HARD.";
        }
    }
}

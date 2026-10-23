export type LearnerLevel = 'eli5' | 'middle_school' | 'high_school' | 'college' | 'curious_adult';

export type LearningStyle = 'analogy' | 'step_by_step' | 'story' | 'socratic' | 'cheat_sheet';

export interface KeyStep {
  stepNumber: number;
  title: string;
  explanation: string;
  keyInsight: string;
}

export interface RealWorldExample {
  title: string;
  scenario: string;
  application: string;
}

export interface CommonMistake {
  myth: string;
  reality: string;
  whyItConfusesPeople: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface CheatSheet {
  keyTerms: KeyTerm[];
  formulaOrRule?: string;
  goldenRule: string;
}

export interface Flashcard {
  front: string;
  back: string;
  category: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningModule {
  topic: string;
  learnerLevel: LearnerLevel;
  learningStyle: LearningStyle;
  title: string;
  oneLiner: string;
  directSolution?: string;
  questionType?: 'concept' | 'problem_solving' | 'math' | 'code' | 'how_to' | 'general';
  bigPicture: string;
  analogy: {
    title: string;
    story: string;
    keyTakeaway: string;
  };
  keySteps: KeyStep[];
  realWorldExamples: RealWorldExample[];
  commonMistakes: CommonMistake[];
  cheatSheet: CheatSheet;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  suggestedFollowUps: string[];
  createdAt: string;
  mastered?: boolean;
}

export interface FollowUpMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface LearnerProfile {
  level: LearnerLevel;
  style: LearningStyle;
  interests: string;
}

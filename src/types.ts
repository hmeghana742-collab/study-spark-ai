export type UserRole = 'student' | 'professor' | 'researcher' | 'professional';

export type LearnerLevel = 'eli5' | 'middle_school' | 'high_school' | 'college' | 'curious_adult' | 'grad_phd';

export type LearningStyle = 'analogy' | 'step_by_step' | 'story' | 'socratic' | 'cheat_sheet' | 'pedagogical_lecture' | 'rigorous_proof';

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

export interface EducatorKit {
  learningObjectives: string[];
  lectureOutline: Array<{
    timeMinutes: string;
    activity: string;
    keyPoints: string;
  }>;
  discussionPrompts: Array<{
    question: string;
    targetInsight: string;
  }>;
  classroomActivity: {
    title: string;
    instructions: string;
    deliverable: string;
  };
  examRubric: Array<{
    criteria: string;
    points: string;
    guidance: string;
  }>;
}

export interface ScholarDepth {
  formalDerivation?: string;
  theoreticalFramework: string;
  researchFrontiers: string[];
}

export interface LearningModule {
  topic: string;
  learnerLevel: LearnerLevel;
  learningStyle: LearningStyle;
  userRole?: UserRole;
  title: string;
  oneLiner: string;
  directSolution?: string;
  questionType?: 'concept' | 'problem_solving' | 'math' | 'code' | 'how_to' | 'general' | 'lecture_unit';
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
  educatorKit?: EducatorKit;
  scholarDepth?: ScholarDepth;
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
  role: UserRole;
  level: LearnerLevel;
  style: LearningStyle;
  interests: string;
}

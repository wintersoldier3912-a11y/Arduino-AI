
export enum View {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  PROJECTS = 'PROJECTS',
  LEARNING_PATH = 'LEARNING_PATH',
  COMPONENTS = 'COMPONENTS',
  CODE_EDITOR = 'CODE_EDITOR',
  CIRCUIT_ANALYZER = 'CIRCUIT_ANALYZER',
  VISION = 'VISION',
  SETTINGS = 'SETTINGS',
  LOGIN = 'LOGIN'
}

export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert'
}

export interface SkillMap {
  electronics: number; // 0.0 to 1.0
  programming: number;
  iot: number;
  debugging: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  timeEstimate: string; // e.g., "2 hours"
  components: string[];
  tags: string[];
  completed: boolean;
}

export interface Component {
  id: string;
  name: string;
  type: 'Microcontroller' | 'Sensor' | 'Actuator' | 'Module' | 'Basic';
  description: string;
  voltage: string;
  pins: string;
  commonUses: string[];
  datasheetUrl?: string;
  difficulty: Difficulty;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface UserProfile {
  name: string;
  skillLevel: Difficulty; // Overall calculated level
  skills: SkillMap;
  projectsCompleted: number;
  conceptsLearned: number;
  streakDays: number;
}


export enum View {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  PROJECTS = 'PROJECTS',
  LEARNING_PATH = 'LEARNING_PATH',
  COMPONENTS = 'COMPONENTS',
  CODE_EDITOR = 'CODE_EDITOR',
  CIRCUIT_ANALYZER = 'CIRCUIT_ANALYZER',
  VISION = 'VISION',
  KNOWLEDGE_BASE = 'KNOWLEDGE_BASE',
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
  electronics: number;
  programming: number;
  iot: number;
  debugging: number;
}

// Added Component interface for hardware inventory and database
export interface Component {
  id: string;
  name: string;
  type: string;
  description: string;
  voltage: string;
  pins: string;
  commonUses: string[];
  difficulty: Difficulty;
  datasheetUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  timeEstimate: string;
  components: string[];
  tags: string[];
  completed: boolean;
  knowledgeBaseId?: string;
}

export interface AgentPlanStep {
  agent: string;
  task: string;
}

export interface AgentResult {
  status: 'ok' | 'fail';
  output: string;
  artifacts?: {
    type: 'code' | 'image' | 'diagram' | 'log';
    name: string;
    content: string;
  }[];
}

export interface MessageMetadata {
  intent?: string;
  plan?: AgentPlanStep[];
  results?: Record<string, AgentResult>;
  next_actions?: string[];
  confidence?: number;
  requires_confirmation?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
  metadata?: MessageMetadata;
}

export interface UserProfile {
  name: string;
  skillLevel: Difficulty;
  skills: SkillMap;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  content: string;
  updatedAt: number;
  sourceType?: 'manual' | 'file' | 'url';
}
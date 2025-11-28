export interface GeneratedImage {
  id: string;
  originalImage: string; // Base64 data URI
  generatedImage: string | null; // Base64 data URI
  prompt: string;
  timestamp: number;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface PresetPrompt {
  label: string;
  text: string;
  icon: string;
}

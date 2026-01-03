
export interface GrammarToken {
  surface: string;
  reading: string;
  definition: string;
  notes?: string;
}

export interface OCRResult {
  originalText: string;
  translation: string;
  tokens: GrammarToken[];
}

export enum AppState {
  IDLE,
  CAPTURING,
  ANALYZING,
  RESULT,
  ERROR
}

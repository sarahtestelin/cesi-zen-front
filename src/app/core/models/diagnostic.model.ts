export interface DiagnosticQuestion {
  id: string;
  question: string;
  score: number;
}

export interface DiagnosticSubmitRequest {
  questionIds: string[];
}

export interface DiagnosticResult {
  id?: string;
  finalScore: number;
  level?: string;
  createdAt?: string;
}

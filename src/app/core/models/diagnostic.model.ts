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
  resultId?: string;
  finalScore: number;
  level: string;
  message: string;
  createdAt?: string;
}

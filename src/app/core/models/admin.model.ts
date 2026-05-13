export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalDiagnostics: number;
  totalDiagnosticQuestions: number;
  totalResultConfigs: number;
  totalResources: number;
}

export interface DiagnosticResultConfig {
  id: string;
  minScore: number;
  maxScore: number;
  level: string;
  message: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

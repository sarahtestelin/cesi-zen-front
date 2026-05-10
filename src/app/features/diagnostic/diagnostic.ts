import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Api } from '../../core/services/api';
import { Auth } from '../../core/services/auth';
import { DiagnosticQuestion, DiagnosticResult } from '../../core/models/diagnostic.model';

@Component({
  selector: 'app-diagnostic',
  templateUrl: './diagnostic.html',
  styleUrl: './diagnostic.scss',
})
export class Diagnostic implements OnInit {
  private readonly api = inject(Api);
  private readonly auth = inject(Auth);

  questions = signal<DiagnosticQuestion[]>([]);
  selectedQuestionIds = signal<string[]>([]);
  result = signal<DiagnosticResult | null>(null);

  isLoading = signal(true);
  isSubmitting = signal(false);
  errorMessage = signal('');

  selectedCount = computed(() => this.selectedQuestionIds().length);

  ngOnInit(): void {
    this.api.getDiagnosticQuestions().subscribe({
      next: (questions) => {
        this.questions.set(questions);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de récupérer les questions du diagnostic.');
        this.isLoading.set(false);
      },
    });
  }

  toggleQuestion(questionId: string): void {
    const selected = this.selectedQuestionIds();

    if (selected.includes(questionId)) {
      this.selectedQuestionIds.set(selected.filter((id) => id !== questionId));
      return;
    }

    this.selectedQuestionIds.set([...selected, questionId]);
  }

  isSelected(questionId: string): boolean {
    return this.selectedQuestionIds().includes(questionId);
  }

  submit(): void {
    this.errorMessage.set('');
    this.result.set(null);

    if (this.selectedQuestionIds().length === 0) {
      this.errorMessage.set('Veuillez sélectionner au moins une situation.');
      return;
    }

    this.isSubmitting.set(true);

    const payload = {
      questionIds: this.selectedQuestionIds(),
    };

    const request = this.auth.isAuthenticated()
      ? this.api.submitAuthenticatedDiagnostic(payload)
      : this.api.submitAnonymousDiagnostic(payload);

    request.subscribe({
      next: (result) => {
        this.result.set(result);
        this.isSubmitting.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de calculer votre diagnostic.');
        this.isSubmitting.set(false);
      },
    });
  }

  reset(): void {
    this.selectedQuestionIds.set([]);
    this.result.set(null);
    this.errorMessage.set('');
  }

  getLevelLabel(result: DiagnosticResult): string {
    if (result.level) {
      return result.level;
    }

    if (result.finalScore < 150) {
      return 'Stress faible';
    }

    if (result.finalScore < 300) {
      return 'Stress modéré';
    }

    return 'Stress élevé';
  }
}

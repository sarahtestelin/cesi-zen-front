import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../../core/services/api';
import { DiagnosticQuestion } from '../../../core/models/diagnostic.model';

type AdminDiagnosticQuestionView = DiagnosticQuestion & {
  active?: boolean;
};

@Component({
  selector: 'app-admin-diagnostic-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-diagnostic-questions.html',
  styleUrl: './admin-diagnostic-questions.scss',
})
export class AdminDiagnosticQuestions implements OnInit {
  private readonly api = inject(Api);

  questions: AdminDiagnosticQuestionView[] = [];
  loading = true;
  successMessage = '';
  errorMessage = '';

  form = {
    id: '',
    question: '',
    score: 0,
  };

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.loading = true;

    this.api.getAdminDiagnosticQuestions().subscribe({
      next: (questions) => {
        this.questions = questions as AdminDiagnosticQuestionView[];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les questions.';
        this.loading = false;
      },
    });
  }

  isQuestionActive(question: AdminDiagnosticQuestionView): boolean {
    return question.active ?? true;
  }

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    const payload = {
      question: this.form.question,
      score: Number(this.form.score),
    };

    const request = this.form.id
      ? this.api.updateDiagnosticQuestion(this.form.id, payload)
      : this.api.createDiagnosticQuestion(payload);

    request.subscribe({
      next: () => {
        this.successMessage = this.form.id
          ? 'Question modifiée avec succès.'
          : 'Question créée avec succès.';
        this.resetForm();
        this.loadQuestions();
      },
      error: () => {
        this.errorMessage = 'Impossible d’enregistrer la question.';
      },
    });
  }

  edit(question: AdminDiagnosticQuestionView): void {
    this.form = {
      id: question.id,
      question: question.question,
      score: question.score,
    };
  }

  cancelEdit(): void {
    this.resetForm();
  }

  disable(id: string): void {
    this.api.disableDiagnosticQuestion(id).subscribe({
      next: () => {
        this.successMessage = 'Question désactivée.';
        this.loadQuestions();
      },
      error: () => {
        this.errorMessage = 'Impossible de désactiver la question.';
      },
    });
  }

  enable(id: string): void {
    this.api.enableDiagnosticQuestion(id).subscribe({
      next: () => {
        this.successMessage = 'Question activée.';
        this.loadQuestions();
      },
      error: () => {
        this.errorMessage = 'Impossible d’activer la question.';
      },
    });
  }

  delete(id: string): void {
    if (!confirm('Supprimer définitivement cette question ?')) {
      return;
    }

    this.api.deleteDiagnosticQuestion(id).subscribe({
      next: () => {
        this.successMessage = 'Question supprimée.';
        this.loadQuestions();
      },
      error: () => {
        this.errorMessage = 'Impossible de supprimer la question.';
      },
    });
  }

  private resetForm(): void {
    this.form = {
      id: '',
      question: '',
      score: 0,
    };
  }
}

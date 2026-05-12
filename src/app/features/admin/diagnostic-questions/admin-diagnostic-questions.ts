import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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
  private readonly toastr = inject(ToastrService);

  questions: AdminDiagnosticQuestionView[] = [];
  loading = true;

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
        this.toastr.error('Impossible de charger les questions.');
        this.loading = false;
      },
    });
  }

  submit(): void {
    const payload = {
      question: this.form.question,
      score: Number(this.form.score),
    };

    const request = this.form.id
      ? this.api.updateDiagnosticQuestion(this.form.id, payload)
      : this.api.createDiagnosticQuestion(payload);

    request.subscribe({
      next: () => {
        this.toastr.success(this.form.id ? 'Question modifiée avec succès.' : 'Question créée avec succès.');
        this.resetForm();
        this.loadQuestions();
      },
      error: () => {
        this.toastr.error('Impossible d\'enregistrer la question.');
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

  delete(id: string): void {
    if (!confirm('Supprimer définitivement cette question ?')) {
      return;
    }

    this.api.deleteDiagnosticQuestion(id).subscribe({
      next: () => {
        this.toastr.success('Question supprimée.');
        this.loadQuestions();
      },
      error: () => {
        this.toastr.error('Impossible de supprimer la question.');
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

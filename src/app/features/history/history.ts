import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Api } from '../../core/services/api';
import { DiagnosticResult } from '../../core/models/diagnostic-result.model';

@Component({
  selector: 'app-history',
  imports: [DatePipe],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class History implements OnInit {
  private readonly api = inject(Api);

  results = signal<DiagnosticResult[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.api.getMyDiagnosticResults().subscribe({
      next: (results) => {
        this.results.set(results);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de récupérer votre historique.');
        this.isLoading.set(false);
      },
    });
  }
}

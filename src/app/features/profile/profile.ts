import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Api } from '../../core/services/api';
import { User } from '../../core/models/user.model';
import { DiagnosticResult } from '../../core/models/diagnostic.model';

@Component({
  selector: 'app-profile',
  imports: [DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly api = inject(Api);

  user = signal<User | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  diagnosticResults = signal<DiagnosticResult[]>([]);
  isDiagnosticsLoading = signal(true);
  diagnosticsError = signal('');

  ngOnInit(): void {
    this.api.getCurrentUser().subscribe({
      next: (user) => {
        this.user.set(user);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de récupérer votre profil.');
        this.isLoading.set(false);
      },
    });

    this.api.getMyDiagnosticResults().subscribe({
      next: (results) => {
        this.diagnosticResults.set(results);
        this.isDiagnosticsLoading.set(false);
      },
      error: () => {
        this.diagnosticsError.set('Impossible de récupérer votre historique.');
        this.isDiagnosticsLoading.set(false);
      },
    });
  }
}

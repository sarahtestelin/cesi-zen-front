import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../../core/services/api';
import { DiagnosticResultConfig } from '../../../core/models/admin.model';

@Component({
  selector: 'app-admin-result-configs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-result-configs.html',
  styleUrl: './admin-result-configs.scss',
})
export class AdminResultConfigs implements OnInit {
  private readonly api = inject(Api);

  configs: DiagnosticResultConfig[] = [];
  loading = true;
  successMessage = '';
  errorMessage = '';

  form = {
    id: '',
    minScore: 0,
    maxScore: 0,
    level: '',
    message: '',
  };

  ngOnInit(): void {
    this.loadConfigs();
  }

  loadConfigs(): void {
    this.loading = true;

    this.api.getDiagnosticResultConfigs().subscribe({
      next: (configs) => {
        this.configs = configs;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les seuils de résultats.';
        this.loading = false;
      },
    });
  }

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    const payload = {
      minScore: Number(this.form.minScore),
      maxScore: Number(this.form.maxScore),
      level: this.form.level,
      message: this.form.message,
    };

    const request = this.form.id
      ? this.api.updateDiagnosticResultConfig(this.form.id, payload)
      : this.api.createDiagnosticResultConfig(payload);

    request.subscribe({
      next: () => {
        this.successMessage = this.form.id
          ? 'Seuil modifié avec succès.'
          : 'Seuil créé avec succès.';
        this.resetForm();
        this.loadConfigs();
      },
      error: () => {
        this.errorMessage = 'Impossible d’enregistrer le seuil.';
      },
    });
  }

  edit(config: DiagnosticResultConfig): void {
    this.form = {
      id: config.id,
      minScore: config.minScore,
      maxScore: config.maxScore,
      level: config.level,
      message: config.message,
    };
  }

  cancelEdit(): void {
    this.resetForm();
  }

  enable(id: string): void {
    this.api.enableDiagnosticResultConfig(id).subscribe({
      next: () => {
        this.successMessage = 'Seuil activé.';
        this.loadConfigs();
      },
      error: () => {
        this.errorMessage = 'Impossible d’activer le seuil.';
      },
    });
  }

  disable(id: string): void {
    this.api.disableDiagnosticResultConfig(id).subscribe({
      next: () => {
        this.successMessage = 'Seuil désactivé.';
        this.loadConfigs();
      },
      error: () => {
        this.errorMessage = 'Impossible de désactiver le seuil.';
      },
    });
  }

  delete(id: string): void {
    if (!confirm('Supprimer définitivement ce seuil ?')) {
      return;
    }

    this.api.deleteDiagnosticResultConfig(id).subscribe({
      next: () => {
        this.successMessage = 'Seuil supprimé.';
        this.loadConfigs();
      },
      error: () => {
        this.errorMessage = 'Impossible de supprimer le seuil.';
      },
    });
  }

  private resetForm(): void {
    this.form = {
      id: '',
      minScore: 0,
      maxScore: 0,
      level: '',
      message: '',
    };
  }
}

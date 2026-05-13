import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../core/services/api';
import { Auth } from '../../core/services/auth';
import { User } from '../../core/models/user.model';
import { DiagnosticResult } from '../../core/models/diagnostic.model';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly api = inject(Api);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  user = signal<User | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  diagnosticResults = signal<DiagnosticResult[]>([]);
  isDiagnosticsLoading = signal(true);
  diagnosticsError = signal('');

  isEditing = signal(false);
  editPseudo = '';
  editMail = '';
  editError = signal('');
  isSaving = signal(false);

  showDeleteConfirm = signal(false);
  isDeleting = signal(false);

  isChangingPassword = signal(false);
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordError = signal('');
  isSavingPassword = signal(false);

  isExporting = signal(false);

  ngOnInit(): void {
    this.api.getCurrentUser().subscribe({
      next: (user) => {
        this.user.set(user);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastr.error('Impossible de récupérer votre profil.');
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

  startEditing(): void {
    const u = this.user();
    if (!u) return;
    this.editPseudo = u.pseudo;
    this.editMail = u.mail;
    this.editError.set('');
    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.isEditing.set(false);
    this.editError.set('');
  }

  saveProfile(): void {
    if (!this.editPseudo.trim() || !this.editMail.trim()) {
      this.editError.set('Le pseudo et l\'email sont obligatoires.');
      return;
    }

    this.isSaving.set(true);
    this.editError.set('');

    this.api.updateCurrentUser({ pseudo: this.editPseudo.trim(), mail: this.editMail.trim() }).subscribe({
      next: (updated) => {
        this.user.set(updated);
        this.isEditing.set(false);
        this.isSaving.set(false);
        this.toastr.success('Profil modifié avec succès !');
      },
      error: () => {
        this.toastr.error('Erreur lors de la mise à jour du profil.');
        this.editError.set('Erreur lors de la mise à jour du profil.');
        this.isSaving.set(false);
      },
    });
  }

  confirmDelete(): void {
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
  }

  deleteAccount(): void {
    this.isDeleting.set(true);
    this.api.deleteCurrentUser().subscribe({
      next: () => {
        this.toastr.success('Compte supprimé.');
        this.auth.logout();
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.toastr.error('Erreur lors de la suppression du compte.');
        this.isDeleting.set(false);
        this.showDeleteConfirm.set(false);
      },
    });
  }

  startChangingPassword(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordError.set('');
    this.isChangingPassword.set(true);
  }

  cancelChangingPassword(): void {
    this.isChangingPassword.set(false);
    this.passwordError.set('');
  }

  savePassword(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordError.set('Tous les champs sont obligatoires.');
      return;
    }
    if (this.newPassword.length < 12) {
      this.passwordError.set('Le nouveau mot de passe doit contenir au moins 12 caractères.');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.isSavingPassword.set(true);
    this.passwordError.set('');

    this.api.changePassword({ currentPassword: this.currentPassword, newPassword: this.newPassword }).subscribe({
      next: () => {
        this.isChangingPassword.set(false);
        this.isSavingPassword.set(false);
        this.toastr.success('Mot de passe modifié avec succès !');
      },
      error: () => {
        this.toastr.error('Mot de passe actuel incorrect.');
        this.passwordError.set('Mot de passe actuel incorrect.');
        this.isSavingPassword.set(false);
      },
    });
  }

  exportData(): void {
    this.isExporting.set(true);
    this.api.exportCurrentUserData().subscribe({
      next: (data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mes-donnees-cesizen.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.isExporting.set(false);
        this.toastr.success('Données exportées !');
      },
      error: () => {
        this.toastr.error('Erreur lors de l\'export des données.');
        this.isExporting.set(false);
      },
    });
  }
}

import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../../core/services/api';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword implements OnInit {
  private readonly api = inject(Api);
  private readonly route = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);

  token = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = signal(false);
  success = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
  }

  submit(): void {
    if (!this.token) {
      this.errorMessage.set('Lien de réinitialisation invalide.');
      return;
    }

    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage.set('Tous les champs sont obligatoires.');
      return;
    }

    if (this.newPassword.length < 12) {
      this.errorMessage.set('Le mot de passe doit contenir au moins 12 caractères.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.api.resetPassword({ token: this.token, newPassword: this.newPassword }).subscribe({
      next: () => {
        this.success.set(true);
        this.isLoading.set(false);
        this.toastr.success('Mot de passe réinitialisé avec succès !');
      },
      error: () => {
        this.toastr.error('Le lien est invalide ou a expiré.');
        this.errorMessage.set('Le lien est invalide ou a expiré. Veuillez refaire une demande.');
        this.isLoading.set(false);
      },
    });
  }
}

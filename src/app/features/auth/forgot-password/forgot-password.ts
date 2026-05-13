import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../../core/services/api';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private readonly api = inject(Api);
  private readonly toastr = inject(ToastrService);

  mail = '';
  isLoading = signal(false);
  sent = signal(false);
  errorMessage = signal('');

  submit(): void {
    if (!this.mail.trim()) {
      this.errorMessage.set('Veuillez saisir votre adresse email.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.api.requestPasswordReset({ mail: this.mail.trim() }).subscribe({
      next: () => {
        this.sent.set(true);
        this.isLoading.set(false);
        this.toastr.success('Si un compte existe, un email a été envoyé.');
      },
      error: () => {
        this.sent.set(true);
        this.isLoading.set(false);
        this.toastr.success('Si un compte existe, un email a été envoyé.');
      },
    });
  }
}

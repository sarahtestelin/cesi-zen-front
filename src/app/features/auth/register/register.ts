import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  mail = '';
  pseudo = '';
  password = '';
  confirmPassword = '';

  errorMessage = signal('');
  isLoading = signal(false);

  submit(): void {
    this.errorMessage.set('');

    if (!this.mail || !this.pseudo || !this.password || !this.confirmPassword) {
      this.errorMessage.set('Veuillez remplir tous les champs.');
      return;
    }

    if (this.password.length < 12) {
      this.errorMessage.set('Le mot de passe doit contenir au moins 12 caractères.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.isLoading.set(true);

    this.auth
      .register({
        mail: this.mail,
        pseudo: this.pseudo,
        password: this.password,
        deviceInfo: 'Navigateur web',
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toastr.success('Inscription réussie !');
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.isLoading.set(false);
          const msg = err?.error?.message || 'Erreur lors de la création du compte';
          this.toastr.error(msg);
          this.errorMessage.set(msg);
        }
      });
  }
}

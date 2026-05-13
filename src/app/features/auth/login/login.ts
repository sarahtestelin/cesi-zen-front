import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  mail = '';
  password = '';
  errorMessage = signal('');
  isLoading = signal(false);

  submit(): void {
    this.errorMessage.set('');

    if (!this.mail || !this.password) {
      this.errorMessage.set('Veuillez renseigner votre email et votre mot de passe.');
      return;
    }

    this.isLoading.set(true);

    this.auth
      .login({
        mail: this.mail,
        password: this.password,
        deviceInfo: 'Navigateur web',
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toastr.success('Connexion réussie !');
          this.router.navigateByUrl('/');
        },
        error: () => {
          this.isLoading.set(false);
          this.toastr.error('Email ou mot de passe incorrect.');
          this.errorMessage.set('Email ou mot de passe incorrect.');
        },
      });
  }
}

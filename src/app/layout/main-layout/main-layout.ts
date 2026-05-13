import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  pseudo = signal<string | null>(null);
  isLoading = signal(false);

  constructor() {
    this.refreshUserPseudo();
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.refreshUserPseudo());
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  logout(): void {
    this.auth.logout();
    this.pseudo.set(null);
    this.toastr.info('Déconnexion réussie.');
    this.router.navigateByUrl('/');
  }

  private refreshUserPseudo(): void {
    this.pseudo.set(this.auth.getUserPseudo());
  }
}

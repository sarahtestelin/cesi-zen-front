import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  pseudo = signal<string | null>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    this.refreshUserPseudo();
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
    this.router.navigateByUrl('/');
  }

  private refreshUserPseudo(): void {
    this.pseudo.set(this.auth.getUserPseudo());
  }
}

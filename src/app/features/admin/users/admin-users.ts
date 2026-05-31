import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../../core/services/api';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss',
})
export class AdminUsers implements OnInit {
  private readonly api = inject(Api);
  private readonly toastr = inject(ToastrService);

  allUsers = signal<User[]>([]);
  loading = signal(true);

  users = computed(() =>
    this.allUsers().filter((u) => u.appUserIsActive && !u.mail.endsWith('@deleted.local')),
  );

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);

    this.api.getUsers().subscribe({
      next: (users) => {
        this.allUsers.set(users);
        this.loading.set(false);
      },
      error: () => {
        this.toastr.error('Impossible de charger la liste des utilisateurs.');
        this.loading.set(false);
      },
    });
  }

  getLastConnection(user: User): string {
    return user.lastConnectionAt ?? '—';
  }

  disableUser(id: string): void {
    this.api.disableUser(id).subscribe({
      next: () => {
        this.toastr.success('Compte désactivé avec succès.');
        this.loadUsers();
      },
      error: () => {
        this.toastr.error('Impossible de désactiver ce compte.');
      },
    });
  }

  promoteUser(id: string): void {
    this.api.promoteUser(id).subscribe({
      next: () => {
        this.toastr.success('Utilisateur promu administrateur.');
        this.loadUsers();
      },
      error: () => {
        this.toastr.error('Impossible de promouvoir cet utilisateur.');
      },
    });
  }

  demoteUser(id: string): void {
    this.api.demoteUser(id).subscribe({
      next: () => {
        this.toastr.success('Rôle administrateur retiré.');
        this.loadUsers();
      },
      error: (err) => {
        this.toastr.error(err.error?.error || 'Impossible de retirer le rôle administrateur.');
      },
    });
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../../core/services/api';
import { User } from '../../../core/models/user.model';

type AdminUserView = User & {
  isActive?: boolean;
  active?: boolean;
};

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

  users: AdminUserView[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;

    this.api.getUsers().subscribe({
      next: (users) => {
        this.users = users as AdminUserView[];
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Impossible de charger la liste des utilisateurs.');
        this.loading = false;
      },
    });
  }

  isUserActive(user: AdminUserView): boolean {
    return user.isActive ?? user.active ?? true;
  }

  getLastConnection(user: AdminUserView): string {
    return user.lastConnectionAt ?? '—';
  }

  enableUser(id: string): void {
    this.api.enableUser(id).subscribe({
      next: () => {
        this.toastr.success('Compte activé avec succès.');
        this.loadUsers();
      },
      error: () => {
        this.toastr.error('Impossible d\'activer ce compte.');
      },
    });
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
}

import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../../core/services/api';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-disabled-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-disabled-users.html',
  styleUrl: './admin-disabled-users.scss',
})
export class AdminDisabledUsers implements OnInit {
  private readonly api = inject(Api);
  private readonly toastr = inject(ToastrService);

  allUsers = signal<User[]>([]);
  loading = signal(true);

  users = computed(() =>
    this.allUsers().filter((u) => !u.appUserIsActive && !u.mail.endsWith('@deleted.local')),
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
        this.toastr.error('Impossible de charger les utilisateurs.');
        this.loading.set(false);
      },
    });
  }

  enableUser(id: string): void {
    this.api.enableUser(id).subscribe({
      next: () => {
        this.toastr.success('Compte réactivé avec succès.');
        this.loadUsers();
      },
      error: () => {
        this.toastr.error("Impossible de réactiver ce compte.");
      },
    });
  }
}

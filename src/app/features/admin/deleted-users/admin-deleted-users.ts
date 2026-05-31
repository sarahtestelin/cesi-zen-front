import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../../core/services/api';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-deleted-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-deleted-users.html',
  styleUrl: './admin-deleted-users.scss',
})
export class AdminDeletedUsers implements OnInit {
  private readonly api = inject(Api);
  private readonly toastr = inject(ToastrService);

  allUsers = signal<User[]>([]);
  loading = signal(true);

  deletedUsers = computed(() =>
    this.allUsers().filter((u) => u.mail.endsWith('@deleted.local')),
  );

  ngOnInit(): void {
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
}

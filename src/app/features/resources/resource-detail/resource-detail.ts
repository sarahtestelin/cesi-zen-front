import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../../../core/services/api';
import { Resource } from '../../../core/models/resource.model';

@Component({
  selector: 'app-resource-detail',
  imports: [DatePipe, RouterLink],
  templateUrl: './resource-detail.html',
  styleUrl: './resource-detail.scss',
})
export class ResourceDetail implements OnInit {
  private readonly api = inject(Api);
  private readonly route = inject(ActivatedRoute);

  resource = signal<Resource | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set('Ressource introuvable.');
      this.isLoading.set(false);
      return;
    }

    this.api.getResource(id).subscribe({
      next: (resource) => {
        this.resource.set(resource);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger cette ressource.');
        this.isLoading.set(false);
      },
    });
  }
}

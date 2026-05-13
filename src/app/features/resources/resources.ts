import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Api } from '../../core/services/api';
import { Resource } from '../../core/models/resource.model';

@Component({
  selector: 'app-resources',
  imports: [DatePipe],
  templateUrl: './resources.html',
  styleUrl: './resources.scss',
})
export class Resources implements OnInit {
  private readonly api = inject(Api);

  resources = signal<Resource[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.api.getResources().subscribe({
      next: (resources) => {
        this.resources.set(resources);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erreur récupération ressources', error);
        this.errorMessage.set('Impossible de récupérer les ressources.');
        this.isLoading.set(false);
      },
    });
  }
}

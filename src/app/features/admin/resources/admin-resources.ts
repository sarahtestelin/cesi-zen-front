import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../../core/services/api';
import { Resource } from '../../../core/models/resource.model';

@Component({
  selector: 'app-admin-resources',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-resources.html',
  styleUrl: './admin-resources.scss',
})
export class AdminResources implements OnInit {
  private readonly api = inject(Api);
  private readonly toastr = inject(ToastrService);

  resources: Resource[] = [];
  loading = true;

  form = {
    id: '',
    title: '',
    description: '',
    category: '',
  };

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.loading = true;

    this.api.getAdminResources().subscribe({
      next: (resources) => {
        this.resources = resources;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Impossible de charger les ressources.');
        this.loading = false;
      },
    });
  }

  submit(): void {
    const payload = {
      title: this.form.title,
      description: this.form.description,
      category: this.form.category,
    };

    const request = this.form.id
      ? this.api.updateResource(this.form.id, payload)
      : this.api.createResource(payload);

    request.subscribe({
      next: () => {
        this.toastr.success(this.form.id ? 'Ressource modifiée avec succès.' : 'Ressource créée avec succès.');
        this.resetForm();
        this.loadResources();
      },
      error: () => {
        this.toastr.error('Impossible d\'enregistrer la ressource.');
      },
    });
  }

  edit(resource: Resource): void {
    this.form = {
      id: resource.id,
      title: resource.title,
      description: resource.description,
      category: resource.category,
    };
  }

  cancelEdit(): void {
    this.resetForm();
  }

  enable(id: string): void {
    this.api.enableResource(id).subscribe({
      next: () => {
        this.toastr.success('Ressource activée.');
        this.loadResources();
      },
      error: () => {
        this.toastr.error('Impossible d\'activer la ressource.');
      },
    });
  }

  disable(id: string): void {
    this.api.disableResource(id).subscribe({
      next: () => {
        this.toastr.success('Ressource désactivée.');
        this.loadResources();
      },
      error: () => {
        this.toastr.error('Impossible de désactiver la ressource.');
      },
    });
  }

  delete(id: string): void {
    if (!confirm('Supprimer définitivement cette ressource ?')) {
      return;
    }

    this.api.deleteResource(id).subscribe({
      next: () => {
        this.toastr.success('Ressource supprimée.');
        this.loadResources();
      },
      error: () => {
        this.toastr.error('Impossible de supprimer la ressource.');
      },
    });
  }

  private resetForm(): void {
    this.form = {
      id: '',
      title: '',
      description: '',
      category: '',
    };
  }
}

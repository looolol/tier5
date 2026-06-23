import { computed, inject, Injectable } from '@angular/core';
import { Backend } from '../backend/backend';
import { Auth } from '../auth/auth';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class InventoryState {
  private readonly backend = inject(Backend);
  private readonly auth = inject(Auth);

  private readonly resource = rxResource({
    params: () => {
      const type = this.auth.membershipType();
      const id = this.auth.membershipId();
      return (id && type) ? { id, type } : null;
    },
    stream: ({ params }) => {
      if (!params) return of(null);
      return this.backend.getInventory();
    }
  });

  public readonly data = computed(() => this.resource.value());
  public readonly isLoading = computed(() => this.resource.isLoading());

  public readonly characters = computed(() => this.data()?.characters ?? []);
  public readonly vault = computed(() => this.data()?.vault ?? []);

  public forceRefresh() {
    this.resource.reload();
  }
}

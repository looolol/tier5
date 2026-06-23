import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiStatusResponse } from '@tier5/bungie-api';
import { InventorySummaryResponse } from '@tier5/bungie-api';

@Injectable({
  providedIn: 'root',
})
export class Backend {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'https://tier5.local/api';

  
  getStatus(): Observable<ApiStatusResponse> {
    return this.http.get<ApiStatusResponse>(`${this.BASE_URL}/status`);
  }

  getInventory(): Observable<InventorySummaryResponse> {
    return this.http.get<InventorySummaryResponse>(`${this.BASE_URL}/live/inventory`);
  }
}

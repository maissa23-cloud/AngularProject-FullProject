import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DashboardStats,
  MonthlySales,
  TopProduct,
  SalesByCategory,
  RecentOrder
} from '../../models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly apiUrl = `${environment.apiBaseUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  getMonthlySales(year?: number): Observable<MonthlySales[]> {
    let params = new HttpParams();
    if (year) {
      params = params.set('year', year.toString());
    }
    return this.http.get<MonthlySales[]>(`${this.apiUrl}/monthly-sales`, { params });
  }

  getTopProducts(count: number = 10): Observable<TopProduct[]> {
    const params = new HttpParams().set('count', count.toString());
    return this.http.get<TopProduct[]>(`${this.apiUrl}/top-products`, { params });
  }

  getSalesByCategory(): Observable<SalesByCategory[]> {
    return this.http.get<SalesByCategory[]>(`${this.apiUrl}/sales-by-category`);
  }

  getRecentOrders(count: number = 10): Observable<RecentOrder[]> {
    const params = new HttpParams().set('count', count.toString());
    return this.http.get<RecentOrder[]>(`${this.apiUrl}/recent-orders`, { params });
  }

  // Admin / Customer specific endpoints
  getAdminDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin`);
  }

  getCustomerDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/customer`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order } from '../../models';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private readonly apiUrl = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) {}

  getOrders(page: number = 1, pageSize: number = 20): Observable<Order[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<Order[]>(this.apiUrl, { params });
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getOrdersByCustomer(customerId: number): Observable<Order[]> {
    const params = new HttpParams().set('customerId', customerId.toString());
    return this.http.get<Order[]>(this.apiUrl, { params });
  }

  getOrdersByDateRange(startDate: string, endDate: string): Observable<Order[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<Order[]>(this.apiUrl, { params });
  }
}

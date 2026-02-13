import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Customer, CustomerCategory } from '../../models';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly apiUrl = `${environment.apiBaseUrl}/customers`;

  constructor(private http: HttpClient) {}

  getCustomers(page: number = 1, pageSize: number = 20): Observable<Customer[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<Customer[]>(this.apiUrl, { params });
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  searchCustomers(query: string): Observable<Customer[]> {
    const params = new HttpParams().set('search', query);
    return this.http.get<Customer[]>(this.apiUrl, { params });
  }

  getCustomerCategories(): Observable<CustomerCategory[]> {
    return this.http.get<CustomerCategory[]>(`${this.apiUrl}/categories`);
  }
}

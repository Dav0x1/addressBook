import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Contact } from '../models/contact.model';
import { Category } from '../models/category.model';
import { Subcategory } from '../models/subcategory.model';
import { Identity } from '../models/identity.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getContacts(paginationPage: number, paginationAmount: number): Observable<Contact[]> {
    return this.http.get<Contact[]>(`/contacts`, {
      params: { paginationPage, paginationAmount }
    });
  }

  getPaginationPages(paginationAmount: number): Observable<number> {
    return this.http.get<{ totalPaginationPages: number }>(`/contacts/paginationPages`, {
      params: { paginationAmount: paginationAmount.toString() }
    }).pipe(
      map(result => result.totalPaginationPages)
    );
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`/contacts/delete`, {
      headers: this.getHeaders(),
      params: { id: id.toString() }
    });
  }

  addContact(contact: Contact): Observable<string> {
    return this.http.post<string>(`/contacts/add`, contact, {
      headers: this.getHeaders()
    });
  }

  updateContact(contact: Contact): Observable<void> {
    return this.http.post<void>(`/contacts/update`, contact, {
      headers: this.getHeaders()
    });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/categories');
  }

  getSubcategories(): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>('/subcategories');
  }

  login(identity: Identity): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`/login`, identity);
  }

  register(identity: Identity): Observable<string> {
    return this.http.post<string>(`/register`, identity);
  }
}

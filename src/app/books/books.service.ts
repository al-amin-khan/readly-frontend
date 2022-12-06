import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Books } from './books';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private apiServerUrl: string = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  public getBooks(): Observable<any>{
    return this.http.get(`${this.apiServerUrl}/books`)
  }

  public addBook(books: any): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/books/add`, books);
  }


  public updateBooks(books: any): Observable<any> {
    return this.http.put<any>(`${this.apiServerUrl}/books/update`, books);
  }


  public deleteBooks(bookId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/books/delete/${bookId}`);
  }


}

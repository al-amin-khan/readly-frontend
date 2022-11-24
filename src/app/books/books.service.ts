import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
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

  public addBook(books: Books): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/books`, books, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }


}

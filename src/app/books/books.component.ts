import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Books } from './books';
import { BooksService } from './books.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  public books: Books[];

  constructor(private bookService: BooksService) {
    this.books = [];
  }

  public getBooks(): void {
    this.bookService.getBooks().subscribe(
      (response: Books[]) => {
        this.books = response;
      },
      (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    )
  }

  public onOpenModal(book: Books, mode: string): void {
    const container =document.getElementById('main-container');
    const button = document.createElement("button");
    button.type = "button";
    button.style.display="none";
    button.setAttribute('data-bs-toggle', 'modal');

    if(mode === "add") {
      button.setAttribute('data-bs-target', '#addBookModal');
    }
    if(mode === "edit") {
      button.setAttribute('data-bs-target', '#updateBookModal')
    }
    if(mode === "delete") {
      button.setAttribute('data-bs-target', '#deleteBookModal')
    }

    container!.appendChild(button);
    button.click;
    console.log(button);
  }

  ngOnInit(): void {
    this.getBooks();
  }


}

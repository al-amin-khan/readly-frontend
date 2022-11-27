import { formatDate, getLocaleDateFormat } from '@angular/common';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Books } from './books';
import { BooksService } from './books.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  // model: NgbDateStruct | undefined;
  public books: Books[] | undefined;
  public imageFile: any;
  public imageLink: any;



  constructor(private bookService: BooksService, private httpClient: HttpClient) {
    // this.books = [];
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

  public onChange(event: any){
    this.imageFile = (event.target.files[0]);
    // const blobFile = new Blob([event.target.files[0]], {
    //   type: 'application/pdf'
    // });
    console.log(this.imageFile);

    let reader = new FileReader();
    reader.readAsDataURL(this.imageFile);
    reader.onload = (event) => {
      this.imageLink = reader.result;
      console.log(this.imageLink);
    };

  }

  public onAddBook(addForm: NgForm): void {
    console.log(addForm);

    const closeButton = document.getElementById("add-book-form") as  HTMLInputElement;
    closeButton.click();

    const publishedDate = new Date(
      addForm?.value?.publishedDate?.year,
      addForm?.value?.publishedDate?.month -1,
      addForm?.value?.publishedDate?.day
      );

    const getFormData = {...addForm.value}
    const newFormData = {
      ...getFormData,
      publishedDate: publishedDate,
    }


    this.bookService.addBook(newFormData).subscribe(
      (response: Books) => {
        console.log(response);
        this.getBooks();

      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  public onOpenModal(book: Books, mode: string): void {
    const container = document.getElementById('main-container') as HTMLElement;
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

    container.appendChild(button);
    button.click;
    console.log(button, container);
  }

  ngOnInit(): void {
    this.getBooks();
  }


}

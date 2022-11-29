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
  public editBooks!: Books;
  public deleteBooks!: Books;
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
    console.log(this.imageFile);

    let reader = new FileReader();
    reader.readAsDataURL(this.imageFile);
    reader.onload = (event) => {
      this.imageLink = reader.result;
      console.log(this.imageLink);
    };

  }

  public onUploadImage(): void {

    const imageBlobFile = this.imageLink;

    this.bookService.uploadBookCoverImage(imageBlobFile).subscribe(
      (response:any) => {
      console.log("response from subscribe:", response);
    },

    (error:any) => {
      console.log("error from subscribe", error.message);
    })
  }

  public onAddBook(addForm: NgForm): void {

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

    const closeButton = document.getElementById("add-book-form") as  HTMLInputElement;
    closeButton.click();


    this.bookService.addBook(newFormData).subscribe(
      (response: Books) => {
        console.log(response);
        this.getBooks();
        newFormData.reset();

      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  public onUpdateBook(books: Books): void {
    // const publishedDate = new Date(
    //   addForm?.value?.publishedDate?.year,
    //   addForm?.value?.publishedDate?.month -1,
    //   addForm?.value?.publishedDate?.day
    //   );

    // const getFormData = {...addForm.value}
    // const newFormData = {
    //   ...getFormData,
    //   publishedDate: publishedDate,
    // }


    this.bookService.updateBooks(books).subscribe(
      (response: Books) => {
        console.log(response);
        this.getBooks();

      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }


  public onDeleteBooks(bookId: number): void {
    this.bookService.deleteBooks(bookId).subscribe(
      (response: void) => {
        console.log(response);
        this.getBooks();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onOpenModal(book: Books, mode: string): void {
    const container = document.getElementById('main-container') as HTMLInputElement;
    const button = document.createElement("button");
    button.type = "button";
    button.style.display="none";
    button.setAttribute('data-bs-toggle', 'modal');

    if(mode === "add") {
      button.setAttribute('data-bs-target', '#addBookModal');
    }
    if(mode === "edit") {
      this.editBooks = book;
      console.log(this.editBooks);

      button.setAttribute('data-bs-target', '#updateBookModal')
    }
    if(mode === "delete") {
      this.deleteBooks = book;
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

import { DatePipe} from '@angular/common';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { Books } from './books';
import { BooksService } from './books.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
  providers: [DatePipe]
})


export class BooksComponent implements OnInit {

  public books: Books[] | undefined;
  public editBooks!: Books;
  public deleteBooks!: Books;
  public apiPhotoURL: string = environment.apiPhotoUrl;
  public imageFile: any;
  public editedPubDate!:any;



  constructor(
    private bookService: BooksService,
    private httpClient: HttpClient,
    private parseFormatter: NgbDateParserFormatter,
    private datePipe: DatePipe,
    ) {
  }

  public getBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (response: Books[]) => {
        this.books = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    })
  }

  public onChange(event: any){
    this.imageFile = (event.target.files[0]);
    console.log(this.imageFile);
  }

  public onLoadDate(event: any){
    const changeDate = (event.target);
    console.log({changeDate});
  }


  public onAddBook(addForm: NgForm): void {
    const formValues = addForm.value;

    const publishedDate = new Date(
      addForm?.value?.publishedDate?.year,
      addForm?.value?.publishedDate?.month -1,
      addForm?.value?.publishedDate?.day
      );

    let formData = new FormData();
    formData.append('title', formValues?.title);
    formData.append('author', formValues?.author);
    formData.append('rating', formValues?.rating);
    formData.append('isbn', formValues?.isbn);
    formData.append('description', formValues?.description);
    formData.append('genre', formValues?.genre);
    formData.append('publishedDate', publishedDate.toString());
    formData.append('pages', formValues?.pages);
    formData.append('language', formValues?.language);
    formData.append('cover', this.imageFile);


    const closeButton = document.getElementById("add-book-form") as  HTMLInputElement;
    closeButton.click();


    this.bookService.addBook(formData).subscribe(
      {
        next: response => {
          console.log("Add Book " + response);
          this.getBooks();
        },
        error: response => {
          console.log(response.error)
        }
      }
    );
  }


  public onUpdateBook(books: Books): void {
    console.log({books});
    const originalDate = books?.publishedDate;
    const parseDate = parseInt(originalDate.toString());

    const newDate = new Date(parseDate);
    // const dateToNgb = {
    //   year: newDate.getUTCFullYear(),
    //   month: newDate.getMonth() + 1,
    //   day: newDate.getDate()
    // };
    // this.editedPubDate = dateToNgb;
    // console.log(this.editedPubDate.year+'-'+this.editedPubDate.month+'-'+this.editedPubDate.day);
    // this.editedPubDate = new Date(books?.publishedDate);

    this.editedPubDate = this.datePipe.transform(newDate, "yyyy-MM-dd");
    // this.editedPubDate = temp;
    // console.log('from ngModel: ',temp);

    let updatedFormData = new FormData();
    updatedFormData.append('title', books?.title);
    updatedFormData.append('author', books?.author);
    updatedFormData.append('rating', (books?.rating).toString());
    updatedFormData.append('isbn', books?.isbn);
    updatedFormData.append('description', books?.description);
    updatedFormData.append('genre', books?.genre);
    updatedFormData.append('publishedDate', books?.publishedDate.toString());
    // updatedFormData.append('publishedDate', );
    updatedFormData.append('pages', (books?.pages).toString());
    updatedFormData.append('language', books?.language);
    updatedFormData.append('cover', this.imageFile);


    const formDataObj:any = {};
    updatedFormData.forEach((value, key) => (formDataObj[key] = value));
    console.log("FormObject: ",formDataObj);


    this.bookService.updateBooks(updatedFormData).subscribe(
      {
        next: response => {
          console.log("Update Book: " + response);
          this.getBooks();
        },
        error: HttpErrorResponse => {
          console.log(HttpErrorResponse.error)
        }
      }
    );
  }


  public onDeleteBooks(bookId: number): void {
    this.bookService.deleteBooks(bookId).subscribe({
      next: (response: void) => {
        console.log(response);
        this.getBooks();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
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

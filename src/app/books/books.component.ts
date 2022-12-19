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

  public books!: Books[];
  public editBooks!: Books;
  public deleteBooks!: Books;
  public apiPhotoURL: string = environment.apiPhotoUrl;
  public imageFile: any;
  public editedPubDate!:any;
  public searchBooks!: any;




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
    const changeDate = (event.target.value);
    console.log({changeDate});
  }


  public onAddBook(addForm: NgForm): void {
    const formValues = addForm.value;
    console.log(formValues.publishedDate);


    // const publishedDate = new Date(
    //   addForm?.value?.publishedDate?.year,
    //   addForm?.value?.publishedDate?.month -1,
    //   addForm?.value?.publishedDate?.day
    //   );

      // const publishedDate: any = "
      //   addForm?.value?.publishedDate?.year,
      //   addForm?.value?.publishedDate?.month,
      //   addForm?.value?.publishedDate?.day
      // ";

      const publishedDate: any = `${addForm?.value?.publishedDate?.year}-${addForm?.value?.publishedDate?.month}-${addForm?.value?.publishedDate?.day}`;

      console.log(publishedDate);
      console.log({date : publishedDate});


    let formData = new FormData();
    formData.append('title', formValues?.title);
    formData.append('author', formValues?.author);
    formData.append('rating', formValues?.rating);
    formData.append('isbn', formValues?.isbn);
    formData.append('description', formValues?.description);
    formData.append('genre', formValues?.genre);
    formData.append('publishedDate', publishedDate);
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
    // console.log({pubDate: (<HTMLInputElement>document.getElementById("publishedDate")).value});
    // const originalDate = books?.publishedDate.split(',');
    // const formateDate = originalDate[0] + '-' + originalDate[1] + '-' + originalDate[2];
    // this.editedPubDate = formateDate;

    // const parseDate = parseInt(originalDate.toString());

    // const newDate = new Date(parseDate);
    // const dateToNgb = {
    //   year: newDate.getUTCFullYear(),
    //   month: newDate.getMonth() + 1,
    //   day: newDate.getDate()
    // };
    // this.editedPubDate = dateToNgb;
    // console.log(this.editedPubDate.year+'-'+this.editedPubDate.month+'-'+this.editedPubDate.day);
    // this.editedPubDate = new Date(books?.publishedDate);

    // this.editedPubDate = this.datePipe.transform(formateDate, "yyyy-MM-dd");
    // this.editedPubDate = temp;
    // console.log('from ngModel: ',temp);

    let updatedFormData = new FormData();
    updatedFormData.append('title', books?.title);
    updatedFormData.append('author', books?.author);
    updatedFormData.append('rating', (books?.rating).toString());
    updatedFormData.append('isbn', books?.isbn);
    updatedFormData.append('description', books?.description);
    updatedFormData.append('genre', books?.genre);
    // updatedFormData.append('publishedDate', books?.publishedDate.toLocaleString());
    updatedFormData.append('publishedDate', this.editedPubDate);
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

  public onSearchBooks(title: any){
    console.log("accessing search");

    this.bookService.searchBooks(title).subscribe({
      next: (response) => {
        console.log(response);
        this.searchBooks = response;
        this.books = response;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    })
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
      console.log('from modal open:', this.editBooks);
      const date = this.editBooks?.publishedDate;
      const formateDate = `${date[0]}-${date[1]}-${date[2]}`;
      console.log(formateDate);
      this.editedPubDate = formateDate;


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

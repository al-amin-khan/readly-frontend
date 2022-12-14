import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

export interface Books{
  id:number;
  title: string;
  cover: File;
  coverPhotoName: string;
  author: string;
  genre: string;
  isbn: string;
  rating: number;
  description: string;
  pages: number;
  publishedDate: any;
  language: string
}

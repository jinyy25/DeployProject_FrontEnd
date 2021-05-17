import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService implements ErrorHandler {

  private userUrl = '/error';

  constructor(private http:HttpClient) { }

  handleError(error: any): void {
    throw new Error('Method not implemented.');
  }

  
}

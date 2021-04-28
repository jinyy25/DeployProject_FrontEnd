import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
//upload-files.service provides methods to save File and get Files from Rest Apis Server.
@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  private userUrl = 'http://localhost:8080/upload';

  constructor(private http: HttpClient) {}
 
  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.userUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
   
  }
  
  getFiles(): Observable<any> {
    return this.http.get(`${this.userUrl}/files`);
  }
  
}
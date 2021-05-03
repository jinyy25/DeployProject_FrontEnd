import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEvent, HttpRequest, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private userUrl = 'http://localhost:8080/upload';

  constructor(private http: HttpClient) { }

  upload(file: File) {
    const formData: FormData = new FormData();

    formData.append('file', file);

    return this.http.post<any>(this.userUrl+"/upload",formData);
   
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.userUrl}/files`);
  }


}

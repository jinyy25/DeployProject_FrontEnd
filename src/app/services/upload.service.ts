import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEvent, HttpRequest, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private userUrl = '/file';

  constructor(private http: HttpClient) { }

  upload(files: File[]) {

    
    const formData: FormData = new FormData();

    for(let i = 0; i< files.length ; i++){
      formData.append('files', files[i]);
    }

    return this.http.post<any>(this.userUrl+"/multi/upload",formData);
   
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.userUrl}/files`);
  }


}

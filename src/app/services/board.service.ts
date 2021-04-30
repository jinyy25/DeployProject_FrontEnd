import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BoardFile } from '../models/boardfile.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private userUrl = 'http://localhost:8080/board';
  
  constructor(private http: HttpClient) { }

  upload(fileList:BoardFile){
    return this.http.post<any>(this.userUrl+"/register",fileList);
  }

}

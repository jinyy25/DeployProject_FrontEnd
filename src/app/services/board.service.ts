import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BoardFile } from '../models/boardfile.model';
import { Notice } from '../models/notice.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private userUrl = 'http://localhost:8080/board';
  
  constructor(private http: HttpClient) { }

  upload(fileList:BoardFile){
    return this.http.post<any>(this.userUrl+"/register",fileList);
  }

  selectNotice(){
    return this.http.get<Notice[]>(this.userUrl);
  }

  selectNoticeDetail(boardNo){
    return this.http.get<any>(this.userUrl+"/"+boardNo)
  }
}

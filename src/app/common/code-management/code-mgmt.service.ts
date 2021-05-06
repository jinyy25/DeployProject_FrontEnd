import { CodeMgmt } from './../code-management/codemgmt.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CodeMgmtService {

  constructor(private http:HttpClient) { }
  private userUrl = 'http://localhost:8080/code';

  public getParentCodeInfos() {
    return this.http.get<CodeMgmt[]>(this.userUrl);
  }
  public getChildCodeInfos(parentCodeId) {
    return this.http.get<CodeMgmt[]>(this.userUrl+"/"+parentCodeId);
  }
  public insertCode(codemgmt : CodeMgmt){
    return this.http.post(this.userUrl, codemgmt);
  }
}

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

  private userUrl = '/code';

  constructor(private http:HttpClient) { }

  public getParentCodeInfos() {
    return this.http.get<CodeMgmt[]>(this.userUrl);
  }
  public getChildCodeInfos(parentCodeId) {
    return this.http.get<CodeMgmt[]>(this.userUrl+"/"+parentCodeId);
  }
  public insertCode(codemgmt : CodeMgmt){
    return this.http.post(this.userUrl, codemgmt);
  }
  public updateCode(codemgmt: CodeMgmt){
    return this.http.patch<any>(this.userUrl, codemgmt);
  }
  public deleteCode(codeId: string) {
    return this.http.delete<any>(this.userUrl+"/"+codeId);
  }
  public selectOneCodeByCodeId(codeId: string) {
    return this.http.get<CodeMgmt>(this.userUrl+"/dialog/"+codeId);
  }
  public checkDsplOrder(dsplOrder: number) {
    return this.http.get<any>(this.userUrl+"/checkParentOrder/"+dsplOrder);
  }
  public checkChildCodeDsplOrder(dsplOrder: number,parentCodeId: string) {
    return this.http.get<any>(this.userUrl+"/"+parentCodeId+"/check/"+dsplOrder);
  }
}

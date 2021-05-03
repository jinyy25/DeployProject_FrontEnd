import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Script } from '../models/script.model';

@Injectable({
  providedIn: 'root'
})
export class ScriptService {
  private httpClient:HttpClient
  constructor() { }

  private scriptURL='http://localhost:8080/script';

  public insertScript(scripts){
    console.log("portal::"+scripts[0].portalScriptp);
    return this.httpClient.post<Script>(this.scriptURL,scripts); 
  }
}

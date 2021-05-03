import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Deploy } from '../models/deploy.model';
import { Script } from '../models/script.model';

@Injectable({
  providedIn: 'root'
})
export class DeployService {

  constructor(
    private httpClient:HttpClient
  ) { }

  private deployURL='http://localhost:8080/deploy-list';
  private scriptURL='http://localhost:8080/script'

  //1. get all deploys
  public getDeploys(){
    console.log("test all");
    return this.httpClient.get<Deploy[]>(this.deployURL);
  }

  //2. insert deploys
  public insertDeploy(deploys){
    console.log(deploys.writer);
    return this.httpClient.post<Deploy>(this.deployURL,deploys);
  }

  //3. insert scripts
  public insertScript(data){
    console.log("check::"+data);
    return this.httpClient.post<Script>(this.scriptURL,data);      
  }
}

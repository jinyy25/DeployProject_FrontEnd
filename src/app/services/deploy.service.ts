import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Deploy } from '../models/deploy.model';

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
    return this.httpClient.post<Deploy>(this.deployURL,deploys);
  }

  //3. insert scripts
  public insertScript(deploys){
    console.log("centerr::" + deploys.centerScript + deploys.category);
    console.log("portall::" + deploys.portalScript + deploys.category);
    console.log("tbw::" + deploys.tbwappScript + deploys.category);
    return this.httpClient.post<Deploy>(this.scriptURL,deploys);      
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Deploy } from '../models/deploy.model';
import { Script } from '../models/script.model';
import { ScriptView } from '../models/scriptView.model';

@Injectable({
  providedIn: 'root'
})
export class DeployService {

  constructor(
    private httpClient:HttpClient
  ) { }

  private deployURL='http://localhost:8080/deploy-list';

  //1. get all deploys
  public getDeploys(){
    return this.httpClient.get<Deploy[]>(this.deployURL);
  }

  //2. insert deploys
  public insertDeploy(deploys){
    return this.httpClient.post<Deploy>(this.deployURL,deploys);
  }

  //3. select deploys
  public selectDeployDetail(deployNo){
      return this.httpClient.get<ScriptView[]>(this.deployURL+"/"+deployNo);
  }

  //4. search deploys
  public searchDeploy(searchCategory,keyword){
    return this.httpClient.get<Deploy[]>(this.deployURL + "/search?searchCategory=" + searchCategory + "&keyword=" + keyword)
  }

  //5. zip download
  public downloadZipFile(deployNo){
    return this.httpClient.post<any>(this.deployURL + "/download/"+deployNo, deployNo);
  }
}

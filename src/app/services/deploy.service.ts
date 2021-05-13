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

  private deployURL='/deploy';

  //1. select all deploys
  public selectDeploys(){
    return this.httpClient.get<any>(this.deployURL);
  }

  //2. insert deploys
  public insertDeploy(deploys){
    return this.httpClient.post<any>(this.deployURL,deploys);
  }

  //3. select scripts
  public selectDeployDetail(deployNo){
      return this.httpClient.get<any>(this.deployURL+"/"+deployNo);
  }

  //4. select deploy
  public selectDeployContent(deployNo){
    return this.httpClient.get<any>(this.deployURL+"/deployContent/"+deployNo);
  }

  //5. search deploys
  public searchDeploy(searchCategory,keyword){
    alert("click:"+searchCategory+keyword);
    return this.httpClient.get<any>(this.deployURL + "/search?searchCategory=" + searchCategory + "&keyword=" + keyword)
  }

  //6. zip download
  public downloadZipFile(deployNo){
    return this.httpClient.post<any>(this.deployURL + "/download/"+deployNo, deployNo);
  }


  //7. file download
  // public fileDownload(deployNo){
  //   return this.httpClient.post<any>();
  // }
}

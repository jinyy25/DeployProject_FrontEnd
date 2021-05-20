import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Deploy } from '../models/deploy.model';
import { Script } from '../models/script.model';
import { ScriptView } from '../models/scriptView.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeployService {

  constructor(
    private httpClient:HttpClient
  ) { }

  private deployURL='/deploy';
  private fileURL='/file';

  //1. select all deploys
  public selectDeploys(){
    return this.httpClient.get<any>(this.deployURL);
  }

  //2. insert deploys
  public insertDeploy(deploys){
    return this.httpClient.post<any>(this.deployURL,deploys);
  }

  //3. select scripts
  public selectScriptDetail(deployNo){
      return this.httpClient.get<any>(this.deployURL+"/"+deployNo);
  }

  //4. select deploy
  public selectDeployDetail(deployNo){
    return this.httpClient.get<any>(this.deployURL+"/deployContent/"+deployNo);
  }

  //5. search deploys
  public searchDeploy(searchCategory,keyword){
    return this.httpClient.get<any>(this.deployURL + "/search?searchCategory=" + searchCategory + "&keyword=" + keyword)
  }


  //6. select File info
  public selectFileInfo(deployNo){
    return this.httpClient.get<any>(this.deployURL + "/search/" + deployNo);
  }

  // to download method
  public fileDownload(filename){
    console.log(filename);
    this.httpClient.get<any>(this.fileURL + "/files/" + filename);
  }


  
}

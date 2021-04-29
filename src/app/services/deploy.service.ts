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

  //1. get all deploys
  public getDeploys(){
    console.log("test all");
    return this.httpClient.get<Deploy[]>(this.deployURL);
  }

  //2. send script
  // public sendScript(){
  //   console.log("test script");
  //   return this.httpClient.post<Deploy[]>(this.deployURL);
  // }
}

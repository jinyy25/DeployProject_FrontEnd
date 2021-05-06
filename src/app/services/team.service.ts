import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http:HttpClient) { }

  private userUrl = "http://localhost:8080/user";

  public selectTeamList(){
	  return this.http.get<any>(this.userUrl+"/register");
  }

}

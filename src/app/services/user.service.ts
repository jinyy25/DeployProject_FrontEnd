import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  private userUrl = "http://localhost:8080/user";

  public createUser(user){
    return this.http.post<User>(this.userUrl+"/register",user);
  }
  public checkId(id){
    return this.http.get<User>(this.userUrl+"/check/"+id);
  }

}

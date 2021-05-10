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

  public insertUser(user){
    return this.http.post<any>(this.userUrl+"/register",user);
  }
  public checkId(id){
    return this.http.get<any>(this.userUrl+"/check/"+id);
  }
  public updateUser(user){
    return this.http.patch<any>(this.userUrl,user);
  }
  public checkPassword(user){
    return this.http.post<any>(this.userUrl+"/check",user);
  }
  public updatePassword(user){
    return this.http.patch<any>(this.userUrl+"/password",user);
  }
  public findId(email){
    return this.http.get<any>(this.userUrl+"/find?email="+email);
  }
  public findPassword(id,email){
    return this.http.get<any>(this.userUrl+"/find/password?id="+id+"&email="+email);
  }

}

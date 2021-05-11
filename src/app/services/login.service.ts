import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  loginUser:User = new User();
  
  constructor(private http:HttpClient) { }

  private userUrl = '/user';

  public login(user){
    return this.http.post<any>(this.userUrl+"/session",user);
  }
}

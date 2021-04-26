import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fadeInUp400ms } from '../../@vex/animations/fade-in-up.animation';
import { User } from '../models/user.model';
import { LoginService } from '../services/login.service';
import { tap } from 'rxjs/operators';
import { JwtService } from '../services/jwt.service';


@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms
  ]
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  inputType = 'password';
  visible = false;

  user:User = new User();

  constructor(private router: Router,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private snackbar: MatSnackBar,
              private loginService:LoginService,
              private jwtService:JwtService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: ['', Validators.required],
      password: ['', Validators.required],
      check:[false,[]]
    });
  }

  send(form,id,password) {
    if(this.form.controls.id.errors != null){
      id.focus();
      return false;
    }else if(this.form.controls.password.errors != null){
      password.focus();
      return false;
    }
    this.user=form.value;
    this.loginService.login(this.user).pipe(
      tap((res :any) => {
          if(form.value.check){
            localStorage.setItem("AUTH_TOKEN", res.data);
            this.loginService.loginUser = this.jwtService.decodeToUser(res.data); 
          }else{
            sessionStorage.setItem("AUTH_TOKEN", res.data);
            this.loginService.loginUser = this.jwtService.decodeToUser(res.data);
          }
      })

    )
      .subscribe(
      res =>{this.router.navigate(['/'])},
      error =>{alert("아이디 비번이 올바르지 않습니다.")}
    )

  }

 
}

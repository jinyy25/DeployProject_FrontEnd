import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { JwtService } from '../services/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'vex-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class PasswordComponent implements OnInit {

  form: FormGroup;
  inputType = 'password';
  user:User = new User();
  check:string;
  loginUser:User;
  password:string;
  newPassword:string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private jwtService : JwtService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      password: ['', Validators.required],
      newPassword: ['', Validators.required],
      newPasswordConfirm: ['', [Validators.required,this.equalTo('newPassword')]],
    })

    this.check = localStorage.getItem("AUTH_TOKEN");

    if(this.check !=null){
       
      this.loginUser = this.jwtService.decodeToUser(this.check);
      
    }else{
      this.check= sessionStorage.getItem("AUTH_TOKEN");

      if(this.check !=null){
        this.loginUser = this.jwtService.decodeToUser(this.check);
      }
    }
  }

  public equalTo(newPassword:string): ValidatorFn{
   return (control: AbstractControl): { [key: string]: any } => {
            let isValid = control.root.value[newPassword] == control.value;
            if (!isValid) {
                return { 'equalTo': { isValid } };
            }
            return null;
        };
  }

  checkPassword(form){
    this.user.password=form.value.password;
    this.user.id=this.loginUser.id;
    this.userService.checkPassword(this.user)
    .subscribe(res=>{
      if(res.data){
        this.password="none";
        this.newPassword="block";
      }else{
        this.form.controls.password.setErrors({checkError:true});
      }
    })
  }//checkPassword(form)

  updatePassword(form){
     if(this.form.controls.newPasswordConfirm.errors != null){
      return false;
    }
    this.user.password=form.value.newPassword
    this.userService.updatePassword(this.user)
    .subscribe(res =>{
      if(res.data){
        localStorage.removeItem("AUTH_TOKEN");
        sessionStorage.removeItem("AUTH_TOKEN");
        this.router.navigate(['/login']);
      }
    })
  }

}
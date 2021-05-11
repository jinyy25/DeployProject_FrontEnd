import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'vex-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class ForgotPasswordComponent implements OnInit {

   form: FormGroup;
   display:string;
   inputType='password';
   ids :string[] = [];
   user:User = new User();
   
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email:['',[Validators.required,Validators.email]],
      id:['',Validators.required],
      newPassword: ['', Validators.required],
      newPasswordConfirm: ['', [Validators.required,this.equalTo('newPassword')]]
    })
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
  findPassword(form){
      if(this.form.controls.email.errors != null){
        return false;
      }else if(this.form.controls.id.errors != null){
        return false;
      }
      this.userService.findPassword(form.controls.id.value,form.controls.email.value)
      .subscribe(res=>{
        if(res.success == false){
          alert("아이디,이메일이 일치하지 않습니다.");
        }else{
          this.display="block";
          this.user.id=res.data;
        }//if~else end
        
      })//subscribe end
    }//findPassword end

    updatePassword(form){
     if(this.form.controls.newPasswordConfirm.errors != null){
      return false;
    }
    
    this.user.password=form.value.newPassword
    this.userService.updatePassword(this.user)
    .subscribe(res =>{
      if(res.success){
        this.router.navigate(['/login']);
      }
    })
  }
}

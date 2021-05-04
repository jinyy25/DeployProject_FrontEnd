import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { User } from '../models/user.model';
import { Team } from '../models/team.model';
import { Router } from '@angular/router';

import { TeamService } from '../services/team.service';
import { UserService } from '../services/user.service';
import { JwtService } from '../services/jwt.service';

@Component({
  selector: 'vex-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss'],
   animations: [
    fadeInUp400ms
  ]
})
export class MypageComponent implements OnInit {
  check:string;
  loginUser:User;
  form: FormGroup;

  inputType = 'password';
  visible = false;

  result:boolean;

  user:User = new User();
  teamList: Team[];

  constructor(
    private router: Router,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private userService : UserService,
              private teamService : TeamService,
              private jwtService : JwtService
              ) { }

  ngOnInit(): void {
  this.check = localStorage.getItem("AUTH_TOKEN");

    if(this.check !=null){
       
      this.loginUser = this.jwtService.decodeToUser(this.check);
      
    }else{
      this.check= sessionStorage.getItem("AUTH_TOKEN");

      if(this.check !=null){
        this.loginUser = this.jwtService.decodeToUser(this.check);
      }
    }

    console.log(this.loginUser);

     this.form = this.fb.group({
     
      email:['',[Validators.required,Validators.email]],
      phone:['',Validators.required],
      position:['',Validators.required],
      name: ['', Validators.required],
      teamNo: ['', Validators.required],    
    });

    this.teamService.selectTeamList()
      .subscribe(data =>{
        this.teamList = data;
        console.log(this.teamList);
      })
  }

  send(form,id,name,position,email,phone,team) {
    
    //유효성검사
    if(this.form.controls.id.errors != null){
      id.focus();
      return false;
    }else if(this.form.controls.name.errors != null){
      name.focus();
      return false;
    }else if(this.form.controls.position.errors != null){
      position.focus();
      return false;
    }else if(this.form.controls.email.errors != null){
      email.focus();
      return false;
    }else if(this.form.controls.phone.errors != null){
      phone.focus();
      return false;
    }else if(this.form.controls.teamNo.errors != null){
      team.focus();
      return false;
    }else if(!form.value.check){
      alert("약관에 동의를 해주세요.");
      return false;
    }

    this.user=form.value;
    this.userService.createUser(this.user)
      .subscribe(data=>{
        if(data){
            location.href="/";
          }
      })
    
  }

}

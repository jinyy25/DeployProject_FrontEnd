import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '../../@vex/animations/fade-in-up.animation';
import { DeployService} from '../services/deploy.service';
import { stagger40ms } from '../../@vex/animations/stagger.animation';
import { Deploy } from '../models/deploy.model';
import {PageEvent} from '@angular/material/paginator';
import { User } from '../models/user.model';
import { JwtService } from '../services/jwt.service';

@Component({
  selector: 'vex-deploy-list',
  templateUrl: './deploy-list.component.html',
  styleUrls: ['./deploy-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],  
})


export class DeployListComponent implements OnInit{

  loginUser : User;
  check:string;

  deploys:Deploy[];
  p: number;//현재 페이지 정보 담기 위함
  itemsPerPage = 5;//한 페이지 당 보여줄 데이터의 수
  totalItems: any;
  
  constructor(
    private deployService:DeployService,
    private jwtService:JwtService
  ){}


  ngOnInit(){
    this.check = localStorage.getItem("AUTH_TOKEN");
    if(this.check !=null){
       this.loginUser = this.jwtService.decodeToUser(this.check);
    }else{
      this.check= sessionStorage.getItem("AUTH_TOKEN");
      if(this.check !=null){
        this.loginUser = this.jwtService.decodeToUser(this.check);
      }
    }

    this.deployService.getDeploys()
    .subscribe(
      response => {this.deploys = response},
    );
  }
  
  getPage(page) {}

}

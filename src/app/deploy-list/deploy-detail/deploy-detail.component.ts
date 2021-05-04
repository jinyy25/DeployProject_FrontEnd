import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Deploy } from 'src/app/models/deploy.model';
import { ScriptView } from 'src/app/models/scriptView.model';
import { DeployService } from 'src/app/services/deploy.service';
import { User } from '../../models/user.model';
import { JwtService } from '../../services/jwt.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'vex-deploy-detail',
  templateUrl: './deploy-detail.component.html',
  styleUrls: ['./deploy-detail.component.scss']
})
export class DeployDetailComponent implements OnInit {
  
  loginUser : User;
  check:string;

  deployNo:number;
  scriptViews:ScriptView[];

  p: number;//현재 페이지 정보 담기 위함
  itemsPerPage = 5;//한 페이지 당 보여줄 데이터의 수
  totalItems: any;

  constructor(
    private deployService:DeployService,
    private route:ActivatedRoute,
    private router:Router,
    private jwtService:JwtService
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

    this.deployNo=this.route.snapshot.params['deployNo'];

    this.deployService.selectDeployDetail(this.deployNo)
    .subscribe(
        response => {this.scriptViews = response},
    )
  }

  getPage(page) {}

}

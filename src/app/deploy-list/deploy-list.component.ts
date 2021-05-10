import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '../../@vex/animations/fade-in-up.animation';
import { DeployService} from '../services/deploy.service';
import { stagger40ms } from '../../@vex/animations/stagger.animation';
import { Deploy } from '../models/deploy.model';
import {PageEvent} from '@angular/material/paginator';
import { User } from '../models/user.model';
import { JwtService } from '../services/jwt.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import icSearch from '@iconify/icons-ic/twotone-search';
import { FormControl } from '@angular/forms';
import { ExcelService } from '../common/excel-download/excel.service';
import { UserExcelService } from '../common/excel-download/userExcel.service';
import { ScriptView } from '../models/scriptView.model';

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
  itemsPerPage = 10;//한 페이지 당 보여줄 데이터의 수
  totalItems: any;
  searchGroup :FormGroup;
  layoutCtrl = new FormControl('boxed');
  icSearch = icSearch;

  scriptViews:ScriptView[];

  constructor(
    private deployService:DeployService,
    private jwtService:JwtService,
    private formBuilder:FormBuilder,
    private excelService : ExcelService,
    private userService : UserExcelService, 
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

    this.searchGroup = this.formBuilder.group({
      searchCategory:['',Validators.required],
      keyword:['',Validators.required]
    })

    this.deployService.getDeploys()
    .subscribe(
      response => {
      this.deploys = response
    }
    );
  }
  
  getPage(page) {}

  search(searchGroup){
    console.log("checkk:"+this.searchGroup.controls.searchCategory);
    if(this.searchGroup.controls.searchCategory.errors != null){
      return false;
    }else if(this.searchGroup.controls.keyword.errors != null){
      return false;
    }
    this.deployService.searchDeploy(this.searchGroup.controls.searchCategory.value,this.searchGroup.controls.keyword.value)
    .subscribe(response => {
      this.deploys = response;
    })
  }


  exportAsXLSX(listTitle:string,deployNo:number):void {  
      this.deployService.selectDeployDetail(deployNo)
      .subscribe(
          response => {
            this.scriptViews = response
            this.excelService.exportAsExcelFile(this.scriptViews, listTitle)
          },
          )
  
  }
}

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
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MY_FORMATS } from '../schedule/insert-schedule/insert-schedule.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Schedule } from '../models/schedule.model';
import { Inject } from '@angular/core';


@Component({
  selector: 'vex-deploy-list',
  templateUrl: './deploy-list.component.html',
  styleUrls: ['./deploy-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]  
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
  selected : string;
  
  category:string;
  scriptViews:ScriptView[];

  constructor(
    private deployService:DeployService,
    private jwtService:JwtService,
    private formBuilder:FormBuilder,
    private excelService : ExcelService,
    private userService : UserExcelService,
    // private dialogRef : MatDialogRef<DeployListComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: Schedule,
    private pipe: DatePipe,
    // private builder: FormBuilder 
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

    // this.selected = 'all'
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
    if(this.searchGroup.controls.searchCategory.errors != null){
      return false;
    }else if(this.searchGroup.controls.keyword.errors != null){
      return false;
    }

    console.log( this.searchGroup.controls.keyword.value);
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

  // dateCheck(){
  // }
  // public modeselect = 'Domain';
  // public selected = 'all'

  sc(value){
    this.category = value
    console.log(value);
}
}

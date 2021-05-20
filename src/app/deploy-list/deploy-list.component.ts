import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import { ScriptView } from '../models/scriptView.model';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MY_FORMATS } from '../schedule/insert-schedule/insert-schedule.component';
import { ExcelService } from '../services/excel-file.service';
import { File } from '../models/file.model';



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
  itemsPerPages = [10,15,20];
  totalItems: any;

  

  searchGroup :FormGroup;
  layoutCtrl = new FormControl('boxed');
  icSearch = icSearch;
  selected : string;
  keyword : any = new String;
  
  category:string;
  scriptViews:ScriptView[];

  all="all";

  file:File = new File();
  changeValue = new String;
  zipName: string;
  
  //엑셀관련
  dataForExcel = [];
  //객체 속성명을 그대로 컬럼명으로 쓰지 않고싶으면 따로 설정 해주어야 함
  dataHeaders = ["스크립트번호","배포번호","구분", "타입", "소스경로", "디렉토리생성","백업스크립트(운영)","운영파일반영스크립트","원복스크립트"]

  @ViewChild('searchValue') searchValue:any; 
  constructor(
    private deployService:DeployService,
    private jwtService:JwtService,
    private formBuilder:FormBuilder,
    private excelService : ExcelService,
    private pipe: DatePipe,
  ){}


  ngOnInit(){
    this.check = localStorage.getItem("AUTH_TOKEN");
    if(this.check !=null){ 
      this.loginUser = this.jwtService.decodeToUser(this.check);
    }

    
    //검색 유효성검사
    this.searchGroup = this.formBuilder.group({
      searchCategory:[''],
      keyword:[''],
    })


    //리스트 불러오기
    this.deployService.selectDeploys()
    .subscribe(
      response => {
      this.deploys = response.data
      this.zipName = response.data.zipName
     }
    );
  }
  //1. 페이징처리
  getPage(page) {
    this.p = page;
  }

  //2. 검색버튼
  search(searchGroup){
    //2-1 select option = all,writer,title
    this.keyword  =this.searchGroup.controls.keyword.value

    //2-2 select option = deployDate
    if(this.category == 'deployDate'){
      this.keyword = this.pipe.transform(this.searchGroup.value.keyword, 'yyyy-MM-dd');
    }
    this.deployService.searchDeploy(this.searchGroup.controls.searchCategory.value,this.keyword)
    .subscribe(response => {
      this.deploys = response.data;
    })
  }


  //3. 엑셀다운로드
  exportToExcel(listTitle:string,deployNo:number):void {  

      this.deployService. selectScriptDetail(deployNo)
      .subscribe(
          response => {
            this.scriptViews = response.data
            this.scriptViews.forEach((row: any) => {
              this.dataForExcel.push(Object.values(row))
            })
  
            let reportData = {
              title: listTitle,
              data: this.dataForExcel,
              headers: this.dataHeaders
            }
            this.excelService.exportExcel(reportData);
          },
      )  
  }

  //4. select option 변화시
  selectValue(value){
    this.category = value;
    this.searchValue.nativeElement.value = null;
    this.changeValue= undefined 
  } 

  //5. 한 페이지에 보여줄 아이템 수 변경시 작동할 메서드
  handlePageSizeChange(event): void {
    this.itemsPerPage = event.target.value;
    this.p = 1;
  }


}

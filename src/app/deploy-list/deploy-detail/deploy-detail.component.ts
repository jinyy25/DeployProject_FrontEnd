import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Deploy } from 'src/app/models/deploy.model';
import { ScriptView } from 'src/app/models/scriptView.model';
import { DeployService } from 'src/app/services/deploy.service';
import { User } from '../../models/user.model';
import { JwtService } from '../../services/jwt.service';
import {PageEvent} from '@angular/material/paginator';
import { ExcelService } from 'src/app/common/excel-download/excel.service';
import { UserExcelService } from 'src/app/common/excel-download/userExcel.service';
import { Observable } from 'rxjs';
import { error } from 'node:console';
import { FormControl } from '@angular/forms';

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

  deploy:Deploy;

  layoutCtrl = new FormControl('boxed');

  p: number;//현재 페이지 정보 담기 위함
  itemsPerPage = 5;//한 페이지 당 보여줄 데이터의 수
  totalItems: any;

  files:File[];
  fileInfos?: Observable<any>;

  constructor(
    private deployService:DeployService,
    private route:ActivatedRoute,
    private router:Router,
    private jwtService:JwtService,
    private excelService : ExcelService,
    private userService : UserExcelService, 
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

  //script정보
  this.deployService.selectDeployDetail(this.deployNo)
    .subscribe(
        response => {this.scriptViews = response},
    )
  
  //deploy정보
  this.deployService.selectDeployContent(this.deployNo)
      .subscribe(
        response => {this.deploy = response}
      )

  }

  //1. 엑셀다운로드
  exportAsXLSX(listTitle:string):void {   
    this.excelService.exportAsExcelFile(this.scriptViews, listTitle);
  }

  //2. 페이징처리
  getPage(page) {}

  //3. zip 다운로드
  downloadZip(deployNo){
    this.deployService.downloadZipFile(deployNo)
    .subscribe(
      response => {
        this.deploy = response
      },
    );
  }

  //4. 취소버튼
  cancel(){
    this.router.navigate(['/deploy-list']);
  }

}

import { colorVariables } from './../../../@vex/components/config-panel/color-variables';
import { logging } from 'protractor';



import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { CodeMgmt } from './codemgmt.model';
import { ChildCodeMgmt } from './child.codemgmt.model';
import { CodeMgmtService } from './code-mgmt.service';
import { InsertUpdateCodeComponent } from './insert-update-code-management/insert-update-code/insert-update-code.component';


import { User } from '../../models/user.model';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'vex-code-management',
  templateUrl: './code-management.component.html',
  styleUrls: ['./code-management.component.scss']
})
export class CodeManagementComponent implements OnInit {

  //로그인 회원 아이디 정보
  loginUser : User;
  check : string;

  codeMgmts: CodeMgmt[];
  childCodeMgmts: ChildCodeMgmt[];
  public show: boolean = false;
  parentCodeId: string;

  

  constructor(private router: Router,
              private codeMgmtService: CodeMgmtService,
              private dialog: MatDialog,
              private jwtService : JwtService) { }

  ngOnInit(): void {
    this.codeMgmtService.getParentCodeInfos().
          subscribe( data => {
          this.codeMgmts = data;
    });

    this.check = localStorage.getItem("AUTH_TOKEN");

    if(this.check !=null) {
       
      this.loginUser = this.jwtService.decodeToUser(this.check);
      
    } else {

      this.check= sessionStorage.getItem("AUTH_TOKEN");

      if(this.check !=null) {
        this.loginUser = this.jwtService.decodeToUser(this.check);
      }
    }
  }

  toggleChildCodeList(parentCodeId) {
    this.show = !this.show;
    this.codeMgmtService.getChildCodeInfos(parentCodeId)
    .subscribe( data => {
      this.childCodeMgmts = data;
    });
  }

  openInsertCodeDialog() : void{//코드 등록 모달창 띄움
    const dialogRef = this.dialog.open(InsertUpdateCodeComponent, {
      //open 메소드는 dialogRef를 리턴
      width : '530px',
      data : {registerer : this.loginUser.id}
    });

    dialogRef.afterClosed().subscribe( result => {//onClose 메소드에서 리턴한 codeMgmt 객체
      result.registerer = this.loginUser.id;
      
      this.codeMgmtService.insertCode(result).subscribe(data=> {
        if(data > 0){
          alert("코드가 등록되었습니다");
        } else {
          alert("등록에 실패하였습니다");
        }//if~else end 
      }

      );

    });
    
  }//openInsertCodeDialog() end 
  openUpdateCodeDialog(codeId){

    console.log(codeId);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      codeId: codeId,
      modifier: this.loginUser.id
    };
    dialogConfig.width = "530";
    const dialogRef = this.dialog.open(InsertUpdateCodeComponent,dialogConfig);

  }


}

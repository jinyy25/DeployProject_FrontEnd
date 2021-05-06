


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { CodeMgmt } from './codemgmt.model';
import { ChildCodeMgmt } from './child.codemgmt.model';
import { CodeMgmtService } from './code-mgmt.service';
import { InsertUpdateCodeComponent } from './insert-update-code-management/insert-update-code/insert-update-code.component';


@Component({
  selector: 'vex-code-management',
  templateUrl: './code-management.component.html',
  styleUrls: ['./code-management.component.scss']
})
export class CodeManagementComponent implements OnInit {

  codeMgmts: CodeMgmt[];
  childCodeMgmts: ChildCodeMgmt[];
  public show:boolean = false;
  parentCodeId: string;

  constructor(private router: Router,
              private codeMgmtService: CodeMgmtService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.codeMgmtService.getParentCodeInfos().
          subscribe( data => {
          console.log(data);
          this.codeMgmts = data;
    });
  }

  toggleChildCodeList(parentCodeId) {
    console.log(parentCodeId);
    this.show = !this.show;
    this.codeMgmtService.getChildCodeInfos(parentCodeId)
    .subscribe( data => {
      console.log(data);
      this.childCodeMgmts = data;
    });
  }

  openInsertCodeDialog() : void{//모달창 띄움
    const dialogRef = this.dialog.open(InsertUpdateCodeComponent, {
      //open 메소드는 dialogRef를 리턴
      width : '530px',
      data : {}
    });

    
  }

  



}

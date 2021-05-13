import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user.model';
import { UserExcelService } from './userExcel.service';
import { ExcelService } from './excel.service';
import { ExcelDownloadService } from './excel-download.service';



@Component({
  selector: 'app-user',
  templateUrl: './excel.component.html',
  styles: []
})
export class ExcelComponent implements OnInit {
  
  users: User[];//엑셀로 export할 데이타
  dataForExcel = [];
  dataHeaders = ["아이디", "이름", "성", "이메일"]
 

  constructor(private router : Router, 
              private userService : UserExcelService, 
              private excelService : ExcelService,
              private excelDownloadService: ExcelDownloadService) {}

 
  ngOnInit() {
    this.userService.getUsers()
      .subscribe( data => {
          this.users = data;
          //console.log(this.users[0]);
    });
  };

  exportAsXLSX(listTitle:string):void {
   
    this.excelService.exportAsExcelFile(this.users, listTitle);
  }

  exportToExcel(listTitle:string) {
    this.users.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row))
      console.log(this.dataForExcel);
    })

    let reportData = {
      title: listTitle,
      data: this.dataForExcel,
      headers: this.dataHeaders
      //headers: Object.keys(this.users[0])
    }

    this.excelDownloadService.exportExcel(reportData);
  }
  

}

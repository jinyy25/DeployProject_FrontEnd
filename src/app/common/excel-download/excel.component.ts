import { ExcelService } from './excel.service';
import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user.model';
import { UserExcelService } from './userExcel.service';


@Component({
  selector: 'app-user',
  templateUrl: './excel.component.html',
  styles: []
})
export class ExcelComponent implements OnInit {
  
  users: User[];

  constructor(private router : Router, 
              private userService : UserExcelService, 
              private excelService : ExcelService) {}

 
  ngOnInit() {
    this.userService.getUsers()
      .subscribe( data => {
          this.users = data;
    });
  };

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.users, 'ExcelFile');
  }
  

}

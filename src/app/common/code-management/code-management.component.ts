

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CodeMgmt } from './codemgmt.model';
import { CodeMgmtService } from './code-mgmt.service';


@Component({
  selector: 'vex-code-management',
  templateUrl: './code-management.component.html',
  styleUrls: ['./code-management.component.scss']
})
export class CodeManagementComponent implements OnInit {

  codeMgmts: CodeMgmt[];

  constructor(private router: Router,
              private codeMgmtService: CodeMgmtService) { }

  ngOnInit(): void {

    this.codeMgmtService.getParentCodeInfos().
          subscribe( data => {
          console.log(data);
          this.codeMgmts = data;
    });
  }

}

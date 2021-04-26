import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '../../@vex/animations/fade-in-up.animation';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'vex-deploy-list',
  templateUrl: './deploy-list.component.html',
  styleUrls: ['./deploy-list.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class DeployListComponent implements OnInit {

  layoutCtrl = new FormControl('boxed');

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

}

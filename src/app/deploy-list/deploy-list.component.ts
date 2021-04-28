import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '../../@vex/animations/fade-in-up.animation';
import { DeployService} from '../services/deploy.service';
import { stagger40ms } from '../../@vex/animations/stagger.animation';
import { Deploy } from '../models/deploy.model';

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

  deploys:Deploy[];

  constructor(
    private deployService:DeployService
  ){}

  ngOnInit(){
    this.deployService.getDeploys()
    .subscribe(
      response => {this.deploys = response},
    );
  }


}

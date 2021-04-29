import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DeployService } from 'src/app/services/deploy.service';
import { ActivatedRoute,Router} from '@angular/router';

@Component({
  selector: 'vex-deploy-write-form',
  templateUrl: './deploy-write-form.component.html',
  styleUrls: ['./deploy-write-form.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class DeployWriteFormComponent implements OnInit {

  // createScript!: FormGroup;
  
  constructor(
    private deployService: DeployService,
    // private formBuilder: FormBuilder,
    // private route:ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }



  // submnit(){
  //   this.deployService.sendScript()
  //     .subscribe(data =>          
  //       // alert("success"))
  //       // this.router.navigate([this.redirectTo?this.redirectTo:'/'])
  // }

}

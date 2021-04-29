import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeployService } from 'src/app/services/deploy.service';
import { Deploy } from '../../models/deploy.model';

@Component({
  selector: 'vex-deploy-write-form',
  templateUrl: './deploy-write-form.component.html',
  styleUrls: ['./deploy-write-form.component.scss']
})
export class DeployWriteFormComponent implements OnInit {

  deployForm: FormGroup;  
  deploys: Deploy[];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private deployService: DeployService,
    ) { 
      this.buildForm();
    }

  ngOnInit(){
  }

  buildForm(): void{
    this.deployForm = this.formBuilder.group({
      title:['',[Validators.required]],
      content:['',[Validators.required]]
    });
  }

   send(deployForm,title,content){
    if(this.deployForm.controls.title.errors !=null){
      title.focus();
      return false;
    }
    
    this.deploys=deployForm.value;
    console.log(this.deploys);
    
    this.deployService.sendScript(this.deploys)
    .subscribe(data => {
      location.href="/";
    })
  }
  

}

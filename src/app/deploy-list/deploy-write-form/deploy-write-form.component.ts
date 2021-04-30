import { CdkDragEnter } from '@angular/cdk/drag-drop';
import { Portal } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeployService } from 'src/app/services/deploy.service';
import { Deploy } from '../../models/deploy.model';
import { Script } from '../../models/script.model';
import { User } from '../../models/user.model';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'vex-deploy-write-form',
  templateUrl: './deploy-write-form.component.html',
  styleUrls: ['./deploy-write-form.component.scss']
})
export class DeployWriteFormComponent implements OnInit {

  loginUser : User;
  check:string;

  deployForm: FormGroup;  
  deploys: Deploy[];
  category: string;

  scripts:Script[];
  selectedFiles : FileList;

  files = [];
  fileNames = [];

  display = "none";

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private deployService: DeployService,
    private jwtService : JwtService
    ) { 
      this.buildForm();
    }

  //로그인관련
  ngOnInit(){
    this.check = localStorage.getItem("AUTH_TOKEN");
    if(this.check !=null){
      this.loginUser = this.jwtService.decodeToUser(this.check);
    }else{
      this.check= sessionStorage.getItem("AUTH_TOKEN");
      if(this.check !=null){
        this.loginUser = this.jwtService.decodeToUser(this.check);
      }
    }
  } 

  //파일다수추가시
  selectFiles(event): void{
    this.files = event.target.files;
    this.display = "block";
  }
  close(obj,text:string): void{
    text = text.substr(1);
    for(let i = 0; i < this.files.length; i++){
      if(this.files[i].name!=text){
        this.fileNames.push(this.files[i]);
      }
    }
    this.files=this.fileNames;
    this.fileNames=[];
  }

  //유효성검사
  buildForm(): void{
    this.deployForm = this.formBuilder.group({
      deployTitle:['',[Validators.required]],
      deployContent:['',[Validators.required]],
      portalScript:[],
      tbwappScript:[],
      centerScript:[]
    });
  }

  // send버튼 누를시
  send(deployForm,deployTitle,deployContent,portalScript,tbwappScript,centerScript){
    if(this.deployForm.controls.deployTitle.errors != null){
      deployTitle.focus();
      return false;
    }
    // writer : this.loginUser.name
    
    this.deploys = deployForm.value;
  
    
    //1. 배포이력전송
    this.deployService.insertDeploy(this.deploys)
    .subscribe(data => {
      location.href="/";
    })


    //2. script 전송
    if(centerScript != null){   
      console.log("######"+this.category);
      this.deploys
      this.deployService.insertScript(this.deploys)
      .subscribe(data=>{
        location.href="/";
        console.log('insertCenter');
      })
    } else if(portalScript != null){       
      this.deployService.insertScript(this.deploys)
      .subscribe(data=>{
        location.href="/";
        console.log('insertPortal');
      })
    } else if(tbwappScript !=null){
      this.deployService.insertScript(this.deploys)
      .subscribe(data=>{
        location.href="/";
        console.log('inserttbwapp');
      })  
    }
    
    

    // this.deployService.insertScript(this.deploys)
    // .subscribe(data=>{
    //   location.href="/";
    // })

    



  }
  

}

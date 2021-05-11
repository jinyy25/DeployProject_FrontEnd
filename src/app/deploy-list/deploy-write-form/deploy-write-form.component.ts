import { CdkDragEnter } from '@angular/cdk/drag-drop';
import { Portal } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { BoardFile } from 'src/app/models/boardfile.model';
import { DeployFile } from 'src/app/models/deploy-file.model';
import { DeployService } from 'src/app/services/deploy.service';
import { UploadService } from 'src/app/services/upload.service';
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
  deploys: Deploy = new Deploy();

  layoutCtrl = new FormControl('boxed');
  fileList:DeployFile = new DeployFile();

  selectedFiles? : FileList;
  files = [];
  fileNames = [];
  display = "none";

  date:any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private deployService: DeployService,
    private jwtService : JwtService,
    private uploadService:UploadService,
    private route:ActivatedRoute,

    ) { 
      this.buildForm();
      setInterval(() =>{
        const currentDate = new Date();
        this.date = currentDate.toLocaleTimeString();
         }, 1000)
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

  //파일 닫기 누를시
  close(obj,text:string): void{
    text=text.substr(1);
   for(let i =0 ; i<this.files.length;i++){
     if(this.files[i].name!=text){
        this.fileNames.push(this.files[i]);
      }
     }
    this.files=this.fileNames;
    this.fileNames=[];
    if(this.files.length==0){
      this.display="none";
    }
  }

  // 유효성검사
  buildForm(): void{
    this.deployForm = this.formBuilder.group({
      deployWriteTitle:['',[Validators.required]],
      deployWriteContent:['',[Validators.required]],
      portalScript:['',[Validators.pattern(/^src/)]],
      tbwappScript:['',[Validators.pattern(/^src/)]],
      centerScript:['',[Validators.pattern(/^src/)]]
    });
  }

  // 1. send버튼 누를시 마지막 경로
  sendData(deploys){
    this.deployService.insertDeploy(deploys)
    .subscribe(data => {
      alert('배포이력 등록 완료');
      location.href="/#/deploy-list";
    })
  }

  // 2. send버튼 누를시
  send(deployForm,deployWriteTitle,deployWriteContent,
        portalScript,tbwappScript,centerScript,files
        ){

    //유효성 검사
    if(this.deployForm.controls.deployWriteTitle.errors != null){
      deployWriteTitle.focus();
      return false;
    }

    //객체에 값 입력
    this.deploys = deployForm.value;
    this.deploys.writer = this.loginUser.name;

    //초기화
    this.deploys.scriptDTO = [];

    //* 변수이름 중복으로 명칭 변경처리
    this.deploys.deployTitle = this.deployForm.controls.deployWriteTitle.value;
    this.deploys.deployContent = this.deployForm.controls.deployWriteContent.value;

    // 2-1. textarea enter구분
    if(portalScript !== null){
      try{
        portalScript = this.deployForm.controls.portalScript.value.split('\n');
        for(var i in portalScript){
          this.deploys.scriptDTO.push({portalScript:portalScript[i],tbwappScript:null,centerScript:null,category:'portal'});
        }
      }catch(e){}
    } 
    if(centerScript != null){
      try{
        centerScript = this.deployForm.controls.centerScript.value.split('\n');
        for(var j in centerScript){
          this.deploys.scriptDTO.push({portalScript:null,tbwappScript:null,centerScript:centerScript[j],category:'center'});
        }
      }catch(e){}
    }
    if(tbwappScript != null){
      try{
        tbwappScript = this.deployForm.controls.tbwappScript.value.split('\n');
        for(var z in tbwappScript){
          this.deploys.scriptDTO.push({portalScript:null,tbwappScript:tbwappScript[z],centerScript:null,category:'tbwapp'});
        }
      }catch(e){}
    }
    
    // 2-2. 파일 추가
    if(this.files.length !=0){
      for(let i = 0 ; i<this.files.length;i++){
        this.uploadService.upload(this.files[i])
        .subscribe(data=>{
          this.fileList.fileNames.push(data.data.name);
          this.fileList.directoryPaths.push(data.data.directoryPath);
          this.deploys.fileNames = this.fileList.fileNames
          this.deploys.directoryPaths = this.fileList.directoryPaths
            if(this.files.length-1==i){
              this.sendData(this.deploys);
            }
          })
      }
    }else{
      this.sendData(this.deploys);
    }
  }

  cancel(){
    this.router.navigate(['/deploy-list']);
  }

  
}

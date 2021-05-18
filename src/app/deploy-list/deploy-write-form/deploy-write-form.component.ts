import { CdkDragEnter } from '@angular/cdk/drag-drop';
import { Portal } from '@angular/cdk/portal';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, tap } from 'rxjs/operators';
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
  deploys: Deploy = new Deploy;

  layoutCtrl = new FormControl('boxed');
  fileList:DeployFile = new DeployFile();

  // selectedFiles? : FileList;

  fileConfirm = [];

  files = [];
  fileNames = [];
  display = "none";

  names=[];
  directoryPaths=[];
  temporary:any[];

  date:any;

  @ViewChild('fileUploader') fileUploader:ElementRef;
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
    }
  } 

  //파일다수추가시
  selectFiles(event): void{
    this.files.push(event.target.files);
    this.display = "block";
  }

  //파일 닫기 누를시
  close(text:string): void{
   
    text=text.substr(1);

    //files는 기존에 선택된 파일을 저장하는 변수
    for(let i =0 ; i<this.files.length;i++){
      this.temporary=this.files[i];
      for(let j=0; j<this.temporary.length;j++){
        if(this.temporary[j].name!=text){
          this.fileNames.push(this.temporary[j]);
        }
      }

    }//for end
    
    this.files=[];
    this.files.push(this.fileNames);
    this.fileNames=[];
    
    
    //파일이 없을때 닫음
    if(this.files[0].length==0){
      this.display="none";
      this.fileUploader.nativeElement.value=null;
    }
  }

  //파일명초기화
  reset(){
    this.fileUploader.nativeElement.value=null;
  }

  // 유효성검사
  buildForm(): void{
    this.deployForm = this.formBuilder.group({
      deployTitle:['',[Validators.required]],
      deployContent:['',[Validators.required]],
      portalScript:['',[Validators.pattern(/^src/)]],
      tbwappScript:['',[Validators.pattern(/^src/)]],
      centerScript:['',[Validators.pattern(/^src/)]]
    });
  }

  // 1. send버튼 누를시 마지막 경로
  sendData(deploys){
    this.deployService.insertDeploy(deploys)
    .subscribe(data => {
      if(data.success){
        alert('배포 등록 성공');
        this.router.navigate(['/deploy-list']);
      }else{
        alert('배포 등록 실패');
      }
    })
  }

  // 2. send버튼 누를시
  send(deployForm,deployTitle,deployContent,
        portalScript,tbwappScript,centerScript,files
        ){
    this.deployForm.markAllAsTouched();

    //유효성 검사
    if(this.deployForm.controls.deployTitle.errors != null){
      deployTitle.focus();
      return false;
    }

    //객체에 값 입력
    this.deploys = deployForm.value;
    this.deploys.writer = this.loginUser.name;

    //초기화
    this.deploys.scriptDTO = [];

    // 2-1. textarea enter구분
    if(portalScript.value != ''){
      try{
        portalScript = this.deployForm.controls.portalScript.value.split('\n');
        for(var i in portalScript){
          this.deploys.scriptDTO.push({portalScript:portalScript[i],tbwappScript:null,centerScript:null,category:'portal'});
          //마지막 enter 구분자일경우 제거
          if(portalScript[portalScript.length-1] = '\n'){
            portalScript.remove(portalScript[portalScript.length-1]);
          }
        }
      }catch(e){}
    } 
    if(centerScript.value != ''){
      try{
        centerScript = this.deployForm.controls.centerScript.value.split('\n');
        for(var j in centerScript){
          this.deploys.scriptDTO.push({portalScript:null,tbwappScript:null,centerScript:centerScript[j],category:'center'});
          if(centerScript[centerScript.length-1] = '\n'){
            centerScript.remove(centerScript[centerScript.length-1]);
          }
        }
      }catch(e){}
    }
    if(tbwappScript.value != ''){
      try{
        tbwappScript = this.deployForm.controls.tbwappScript.value.split('\n');
        for(var z in tbwappScript){
          this.deploys.scriptDTO.push({portalScript:null,tbwappScript:tbwappScript[z],centerScript:null,category:'tbwapp'});
          if(tbwappScript[tbwappScript.length-1] = '\n'){
            tbwappScript.remove(tbwappScript[tbwappScript.length-1]);
          }
        }
      }catch(e){}
    }

    // 2-2. 파일 추가
    if(this.files.length !=0){
        this.uploadService.upload(this.files)
        .subscribe(data=>{
            if(data.success){
              this.deploys.names = data.data.names
              this.deploys.directoryPaths = data.data.directoryPaths
              this.sendData(this.deploys);
            }else{
              alert("파일을 올바르게 입력해주세요");
            }
          })
    }else{
      this.sendData(this.deploys);
    }
  }


  // 취소버튼
  cancel(){
    this.router.navigate(['/deploy-list']);
  }

  
}

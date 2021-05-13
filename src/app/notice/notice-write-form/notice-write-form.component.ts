import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { UploadService } from 'src/app/services/upload.service';
import { BoardFile } from 'src/app/models/boardfile.model';

import { JwtService } from 'src/app/services/jwt.service';
import { User } from 'src/app/models/user.model';
import { BoardService } from 'src/app/services/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Notice } from 'src/app/models/notice.model';
import { delay, tap } from 'rxjs/operators';
import { async } from 'rxjs';
import { R3TargetBinder } from '@angular/compiler';



@Component({
  selector: 'vex-notice-write-form',
  templateUrl: './notice-write-form.component.html',
  styleUrls: [
    './notice-write-form.component.scss',
    '../../../../node_modules/quill/dist/quill.snow.css',
    '../../../@vex/styles/partials/plugins/_quill.scss'

],
  encapsulation: ViewEncapsulation.None,
  animations: [
    fadeInUp400ms
  ]
})
export class NoticeWriteFormComponent implements OnInit {

  selectedFiles?: FileList;
  files = [];
  fileNames  = [];
  fileConfirm = [];
  form: FormGroup;
  display ="none";
  loginUser:User;
  check:string;
  fileList:BoardFile = new BoardFile();
  boardNo:number;
  notice:Notice = new Notice();
  status="true";

  @ViewChild('fileUploader') fileUploader:ElementRef;

  constructor(
    private fb:FormBuilder,
    private uploadService:UploadService,
    private jwtService:JwtService,

    private boardService:BoardService,
    private route:ActivatedRoute,
    private router:Router,
    
    
    

  ) { }

  ngOnInit(): void {
    this.form=this.fb.group({
      title:['',Validators.required],
      content:['',Validators.required]
    })


    //수정일 경우
    this.boardNo=this.route.snapshot.params['boardNo'];
    if(this.boardNo !=null){
      this.boardService.selectNoticeDetail(this.boardNo)
      .subscribe(res=>{
        
        this.notice=res.data.board;
        this.files=res.data.files;

        //기존에 있던 파일인지 확인하는 변수
        this.fileConfirm=res.data.files;
        if(this.files.length>0){
          this.display="block";
        }else{
          this.display="none";
        }
      })
    }
  }

   delay = () => {
    const randomDelay = Math.floor(Math.random() * 4) * 100
    return new Promise(resolve => setTimeout(resolve, randomDelay))
  }


  selectFiles(event): void {
    this.files=event.target.files;
    this.display="block";

    //파일 선택하면 기존파일이 사라지므로 확인하는 변수 초기화
    this.fileConfirm=[];
    
  }
  
  close(obj,text:string): void{
    text=text.substr(1);
    
    //files는 기존에 선택된 파일을 저장하는 변수
    for(let i =0 ; i<this.files.length;i++){
      
      //삭제한 파일이름과 다를때 fileNames에 넣어줌
      if(this.files[i].name!=text){
        
        this.fileNames.push(this.files[i]);
        
      }//if end
      
    }//for end
    
    
    this.files=this.fileNames;
    this.fileNames=[];
    
    //파일이 없을때 닫음
    if(this.files.length==0){
      //this.fileUploader.nativeElement.target=null;
      this.display="none";
      this.fileConfirm=[];
    }
    
  }//close() end

  

  //업로드된 파일과 공지사항내용 DB insert 메서드
  addFileList(form,type){

    //로그인 유저정보 추출
    this.check = localStorage.getItem("AUTH_TOKEN"); 
      if(this.check !=null){ 
        this.loginUser=this.jwtService.decodeToUser(this.check);
      }else{
        this.check= sessionStorage.getItem("AUTH_TOKEN");

        if(this.check !=null){
          this.loginUser = this.jwtService.decodeToUser(this.check);
        }//if end
      }//if~else end


      this.fileList.writer=this.loginUser.id;
      this.fileList.content=form.controls.content.value;
      this.fileList.title=form.controls.title.value;

      if(type=="insert"){

        this.boardService.upload(this.fileList)
        .subscribe(data =>{

          this.router.navigate(['/notice/'+data.data]);

        })
      }else{

        this.boardService.updateNotice(this.fileList,this.boardNo)
        .subscribe(res =>{
          this.status="true";
           this.router.navigate(['/notice/'+res.data]);

        })
      }
     
      
  }
 

  //파일 업로드 메서드
  upload(form,type){
  
    if(type=="insert"){
      if(this.form.controls.title.errors != null){
        return false;
      }else if(this.form.controls.content.errors != null){
        return false;
      }
    }//if end

    this.status="wait";  
    if(this.files.length !=0){
         this.uploadService.upload(this.files)
         .pipe(tap((res:any)=>{
           this.fileList.names=res.data.names;
           this.fileList.directoryPaths=res.data.directoryPaths;

          })
         )
         .subscribe(res=>{
                this.addFileList(form,type);
          })

    }else{
      this.addFileList(form,type);

    }//if~else end 
  }//upload()end


  insert(form){
    const type="insert";
    this.upload(form,type);
  }

  update(form){
    const type="update";
    
    //기존에 있었던 파일 일때
    if(this.fileConfirm.length>0){

      for(let i =0; i < this.fileConfirm.length;i++){
        for(let j=0; j< this.files.length; j++){ 
          
          //기존에 있던 파일 선별
          if(this.files[j]==this.fileConfirm[i]){
            this.fileList.names.push(this.files[j].name);
            this.fileList.directoryPaths.push(this.files[j].directoryPath);
            
          }//if end
        }//for end
      }//for end


      this.addFileList(form,type);

    }else{
      this.upload(form,type);
    }
    
  }

  cancel(){
    this.router.navigate(['/notice']);
  }
}

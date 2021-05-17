import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, ɵɵtrustConstantResourceUrl, ComponentFactoryResolver } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { UploadService } from 'src/app/services/upload.service';
import { BoardFile } from 'src/app/models/boardfile.model';

import { JwtService } from 'src/app/services/jwt.service';
import { User } from 'src/app/models/user.model';
import { BoardService } from 'src/app/services/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Notice } from 'src/app/models/notice.model';
import { tap } from 'rxjs/operators';

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

  //selectedFiles?: FileList;
  names=[];
  directoryPaths=[];
  temporary:any[];
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
    if(this.boardNo == null){

      this.form=this.fb.group({
        title:['',Validators.required],
        content:['',Validators.required]
      })
    }


    //수정일 경우
    this.boardNo=this.route.snapshot.params['boardNo'];
    if(this.boardNo !=null){
      this.boardService.selectNoticeDetail(this.boardNo)
      .subscribe(res=>{
        
        this.notice=res.data.board;
        this.files.push(res.data.files);
        this.fileConfirm=res.data.files;
        

        this.form=this.fb.group({
          title:[this.notice.title,Validators.required],
          content:[this.notice.content,Validators.required]
        })

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


  reset(){
    this.fileUploader.nativeElement.value=null;
  }

  selectFiles(event): void {

    this.files.push(event.target.files);

    this.display="block";
   
  }
  
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

        for(let i in this.names){
          this.fileList.names.push(this.names[i]);
        }
        for(let i in this.directoryPaths){
          this.fileList.directoryPaths.push(this.directoryPaths[i]);
        }

        this.boardService.updateNotice(this.fileList,this.boardNo)
        .subscribe(res =>{
          this.status="true";
           this.router.navigate(['/notice/'+res.data]);

        })
      }
     
      
  }
 

  //파일 업로드 메서드
  upload(form,type){

    this.status="wait";  
    if(this.files.length !=0){
         this.uploadService.upload(this.files)
         .pipe(tap((res:any)=>{
          if(res.data!=null){
            this.fileList.names=res.data.names;
            this.fileList.directoryPaths=res.data.directoryPaths;
          }
           
          })
         )
         .subscribe(res=>{
                this.addFileList(form,type);
          })

    }else{
      this.addFileList(form,type);

    }//if~else end 
  }//upload()end


  insert(form,title){
    this.form.markAllAsTouched();//mat error 뜨게
    if(this.form.controls.title.errors != null){
      title.focus();
      return false;
    }else if(this.form.controls.content.errors != null){
      alert("내용을 입력해 주세요.");
      return false;
    }
    const type="insert";
    this.upload(form,type);
  }

  update(form,title){
    this.form.markAllAsTouched();//mat error 뜨게
     if(this.form.controls.title.errors != null){
        title.focus();
        return false;
      }else if(this.form.controls.content.errors != null){
        alert("내용을 입력해 주세요.");
        return false;
      }
    const type="update";
    
    
    for(let j=0; j< this.files.length; j++){ 
        this.temporary = this.files[j];
      for(let i =0; i < this.fileConfirm.length;i++){
          for(let temp in this.temporary){
            if(this.temporary[temp].name==this.fileConfirm[i].name){
               this.names.push(this.temporary[temp].name);
               this.directoryPaths.push(this.temporary[temp].directoryPath); 
            }
             
          }

        }//for end
      }//for end
     

      this.upload(form,type);

  }

  cancel(){
    this.router.navigate(['/notice']);
  }
}

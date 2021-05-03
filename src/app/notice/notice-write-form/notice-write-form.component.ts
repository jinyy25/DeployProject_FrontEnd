import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadService } from 'src/app/services/upload.service';
import { BoardFile } from 'src/app/models/boardfile.model';

import { JwtService } from 'src/app/services/jwt.service';
import { User } from 'src/app/models/user.model';
import { BoardService } from 'src/app/services/board.service';


@Component({
  selector: 'vex-notice-write-form',
  templateUrl: './notice-write-form.component.html',
  styleUrls: ['./notice-write-form.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class NoticeWriteFormComponent implements OnInit {
  selectedFiles?: FileList;
  files = [];
  fileNames  = [];
  form: FormGroup;
  display ="none";
  loginUser:User;
  check:string;
  fileList:BoardFile = new BoardFile();

  constructor(
    private fb:FormBuilder,
    private uploadService:UploadService,
    private jwtService:JwtService,
    private boardService:BoardService    
  ) { }

  ngOnInit(): void {
    this.form=this.fb.group({
      title:['',Validators.required],
      content:['',Validators.required]
    })
  }

  selectFiles(event): void {
    this.files=event.target.files;
    this.display="block";
  }
  close(obj,text:string): void{
    text=text.substr(1);
   for(let i =0 ; i<this.files.length;i++){


     if(this.files[i].name!=text){

      this.fileNames.push(this.files[i]);

     }//if end
     
    }//for end
    this.files=this.fileNames;
    this.fileNames=[];
    
  }//close() end

  addFileList(form){
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

      this.boardService.upload(this.fileList)
      .subscribe(data =>{
          if(data.data=="success"){
            console.log("공지사항 인서트");
          }
      })
  }

  upload(form){
    if(this.form.controls.title.errors != null){
      return false;
    }else if(this.form.controls.content.errors != null){
      return false;
    }

    if(this.files.length !=0){
      for(let i = 0 ; i<this.files.length;i++){
        this.uploadService.upload(this.files[i])
          .subscribe(data=>{
            this.fileList.names.push(data.data);
            this.fileList.directoryPaths[i]="C:\\uploads";
            

            if(this.files.length-1==i){
              
              this.addFileList(form);

            }//if end

          })
      }//for end

      

    }else{
      this.addFileList(form);

    }//if~else end


    
    
      
   
  }//upload()end
}

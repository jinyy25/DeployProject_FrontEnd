import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadService } from 'src/app/services/upload.service';
import { BoardFile } from 'src/app/models/boardfile.model';

import { JwtService } from 'src/app/services/jwt.service';
import { User } from 'src/app/models/user.model';
import { BoardService } from 'src/app/services/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Notice } from 'src/app/models/notice.model';
import { UpdateScheduleComponent } from 'src/app/schedule/update-schedule/update-schedule.component';


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
  boardNo:number;
  notice:Notice = new Notice();

  constructor(
    private fb:FormBuilder,
    private uploadService:UploadService,
    private jwtService:JwtService,

    private boardService:BoardService,
    private route:ActivatedRoute,
    private router:Router
    

  ) { }

  ngOnInit(): void {
    this.form=this.fb.group({
      title:['',Validators.required],
      content:['',Validators.required]
    })


    
    this.boardNo=this.route.snapshot.params['boardNo'];
    if(this.boardNo !=null){
      this.boardService.selectNoticeDetail(this.boardNo)
      .subscribe(res=>{
        this.notice=res.data.board;
        this.files=res.data.files;
        if(this.files.length>0){
          this.display="block";
        }else{
          this.display="none";
        }
      })
    }else{

    }
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
    if(this.files.length==0){
      this.display="none";
    }
    
  }//close() end

  addFileList(form,type){


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
        console.log(this.fileList+"업뎃");
        this.boardService.updateNotice(this.fileList,this.boardNo)
        .subscribe(res =>{
           this.router.navigate(['/notice/'+res.data]);
        })
      }
 
      
  }

  


  upload(form,type){
    console.log(form);
    if(type=="insert"){
      if(this.form.controls.title.errors != null){
        return false;
      }else if(this.form.controls.content.errors != null){
        return false;
      }
    }//if end


    if(this.files.length !=0){
      console.log(this.files);
      for(let i = 0 ; i<this.files.length;i++){
        this.uploadService.upload(this.files[i])
          .subscribe(data=>{
            this.fileList.names.push(data.data.name);
            this.fileList.directoryPaths[i]=data.data.directoryPath;
            
            if(this.files.length-1==i){
                this.addFileList(form,type);
            
            }//if end

          })
      }//for end

      

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
    this.upload(form,type);
  }

  cancel(){
    this.router.navigate(['/notice']);
  }
}

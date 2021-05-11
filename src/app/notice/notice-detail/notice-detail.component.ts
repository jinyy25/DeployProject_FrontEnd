import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Notice } from 'src/app/models/notice.model';
import { File } from 'src/app/models/file.model';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { UploadService } from 'src/app/services/upload.service';
import { Observable } from 'rxjs';

import { JwtService } from 'src/app/services/jwt.service';
import { User } from 'src/app/models/user.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'vex-notice-detail',
  templateUrl: './notice-detail.component.html',
  styleUrls: ['./notice-detail.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class NoticeDetailComponent implements OnInit {

  layoutCtrl = new FormControl('boxed');
  boardNo:number;
  notice:Notice = new Notice();
  files:File[];
  fileInfos?: Observable<any>;
  check:string;
  loginUser:User;  
  display:string;
  
  constructor(
    private boardService:BoardService,
    private uploadService:UploadService,
    private route:ActivatedRoute,
    private router:Router,
    private jwtService:JwtService
  ) { }

  ngOnInit(): void {
     this.check = localStorage.getItem("AUTH_TOKEN"); 
      if(this.check !=null){ 
        this.loginUser=this.jwtService.decodeToUser(this.check);
      }else{
        this.check= sessionStorage.getItem("AUTH_TOKEN");

        if(this.check !=null){
          this.loginUser = this.jwtService.decodeToUser(this.check);
        }//if end
      }//if~else end
      
    this.boardNo=this.route.snapshot.params['boardNo'];

    this.boardService.selectNoticeDetail(this.boardNo)
    .subscribe(data=>{
      console.log(data);
      this.notice=data.data.board;
      this.files=data.data.files;
      
      
      
      console.log(this.notice.content);
      if(this.files.length>0){
        this.display="block";
      }
    })
    
  }

  selectList(){
    this.router.navigate(['/notice']);
  }

  updateNotice(boardNo){
    this.router.navigate(['/notice/modify/'+boardNo]);
  }

  deleteNotice(boardNo){
    this.boardService.deleteNotice(boardNo)
    .subscribe(res=>{
      if(res.data==1){
        this.router.navigate(['/notice']);
      }
    })
  }

}

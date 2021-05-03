import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Notice } from 'src/app/models/notice.model';
import { File } from 'src/app/models/file.model';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { UploadService } from 'src/app/services/upload.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'vex-notice-detail',
  templateUrl: './notice-detail.component.html',
  styleUrls: ['./notice-detail.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class NoticeDetailComponent implements OnInit {

  boardNo:number;
  notice:Notice = new Notice();
  files:File[];
  fileInfos?: Observable<any>;  
  constructor(
    private boardService:BoardService,
    private uploadService:UploadService,
    private route:ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.boardNo=this.route.snapshot.params['boardNo'];

    this.boardService.selectNoticeDetail(this.boardNo)
    .subscribe(data=>{
      this.notice=data.data.board;
      this.files=data.data.files;
      
      
    })
    this.fileInfos=this.uploadService.getFiles();
    console.log(this.fileInfos);

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

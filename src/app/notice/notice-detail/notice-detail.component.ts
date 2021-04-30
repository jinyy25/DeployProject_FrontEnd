import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'vex-notice-detail',
  templateUrl: './notice-detail.component.html',
  styleUrls: ['./notice-detail.component.scss']
})
export class NoticeDetailComponent implements OnInit {

  boardNo:number;  
  constructor(
    private boardService:BoardService,
    private route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.boardNo=this.route.snapshot.params['boardNo'];

    this.boardService.selectNoticeDetail(this.boardNo)
    .subscribe(data=>{
      console.log(data);
    })
  }

}

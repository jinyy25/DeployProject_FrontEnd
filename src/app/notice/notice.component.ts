import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BoardService } from '../services/board.service';
import { Notice } from '../models/notice.model';
import icSearch from '@iconify/icons-ic/twotone-search';
import { Team } from '../models/team.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'vex-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class NoticeComponent implements OnInit {

  p: number;//현재 페이지 정보 담기 위함
  itemsPerPage = 10;//한 페이지 당 보여줄 데이터의 수
  itemsPerPages=[10,15,20];
  totalItems: any;
  form: FormGroup;
  notices:Notice[];
  layoutCtrl = new FormControl('boxed');
  icSearch = icSearch;
  teams:Team[];
  searchCtrl = new FormControl();
  teamName:string;
  title="title";
  page:string;
  itemPage:string;

  constructor(
     private fb:FormBuilder,
     private boardService:BoardService,
     private router:Router
  ) { }

  ngOnInit(): void {
    
    this.page = localStorage.getItem("NOTICE_PAGE");
    this.itemPage = localStorage.getItem("NOTICE_ITEM_PAGE");
    if(this.page!=null){
      this.p=parseInt(this.page);
      localStorage.removeItem("NOTICE_PAGE");
    }else{
      this.p=1;
    }

    if(this.itemPage!=null){
      this.itemsPerPage=parseInt(this.itemPage);
      localStorage.removeItem("NOTICE_ITEM_PAGE");
    }


    this.boardService.selectNotice()
    .subscribe(res =>{
      this.teams=res.data.teamList;
      this.notices=res.data.noticeList;
      this.teamName="전체";
    })
    

    this.form=this.fb.group({
      type:[this.title,Validators.required],
      word:['',Validators.required]
    })
  }

  getPage(event) {
    this.p=event;
  }//페이지 변경시 호출 될 메서드

  //검색
  search(form){
    if(this.form.controls.type.errors !=null){
      return false;
    }else if(this.form.controls.word.errors !=null){
      return false;
    }
    this.boardService.searchNotice(this.form.controls.type.value,this.form.controls.word.value)
    .subscribe(res=>{
      this.teamName="전체";
      this.notices=res.data;
      this.p=1;
    })
  }

  //전체
  selectNotice(){
    this.teamName="전체";
    this.boardService.selectNotice()
    .subscribe(res =>{
      this.teams=res.data.teamList;
      this.notices=res.data.noticeList;
      this.p=1;
    })
  }

  //팀별검색
  selectTeamNotice(team){
    this.teamName=team.codeName;
    this.boardService.selectTeamNotice(team.codeName)
      .subscribe(res =>{
        this.notices=res.data;
        this.p=1;
      })
  }

  //한 페이지에 보여줄 아이템 수 변경시 작동할 메서드
  handlePageSizeChange(event): void {
    this.itemsPerPage = event.target.value;
    this.p = 1;
  }

  link(boardNo){
    localStorage.setItem("NOTICE_PAGE",""+this.p);
    localStorage.setItem("NOTICE_ITEM_PAGE",""+this.itemsPerPage);
    this.router.navigate(["/notice/"+boardNo]);
  }
 
}

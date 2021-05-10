import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BoardService } from '../services/board.service';
import { Notice } from '../models/notice.model';
import icSearch from '@iconify/icons-ic/twotone-search';
import { Team } from '../models/team.model';

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
  totalItems: any;
  form: FormGroup;
  notices:Notice[];
  layoutCtrl = new FormControl('boxed');
  icSearch = icSearch;
  teams:Team[];
  searchCtrl = new FormControl();

  


  constructor(
     private fb:FormBuilder,
     private boardService:BoardService
  ) { }

  ngOnInit(): void {
    this.boardService.selectNotice()
    .subscribe(data =>{
      this.teams=data.teamList;
      this.notices=data.noticeList;
      
    })
    

    this.form=this.fb.group({
      type:['',Validators.required],
      word:['',Validators.required]
    })
  }
  getPage(page) {}//페이지 변경시 호출 될 메서드

  search(form){
    if(this.form.controls.type.errors !=null){
      return false;
    }else if(this.form.controls.word.errors !=null){
      return false;
    }
    this.boardService.searchNotice(this.form.controls.type.value,this.form.controls.word.value)
    .subscribe(res=>{
      this.notices=res;
    })
  }

  selectNotice(){
    this.boardService.selectNotice()
    .subscribe(data =>{
      this.teams=data.teamList;
      this.notices=data.noticeList;
      
    })
  }

  selectTeamNotice(team){
    this.boardService.selectTeamNotice(team.codeName)
      .subscribe(res =>{
        this.notices=res;
      })
  }
 
}

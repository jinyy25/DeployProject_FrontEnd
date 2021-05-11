import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Schedule } from '../models/schedule.model';
import { Team } from '../models/team.model';
import { User } from '../models/user.model';
import { JwtService } from '../services/jwt.service';
import { ScheduleService } from '../services/schedule.service';
import { TeamService } from '../services/team.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'vex-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loginUser : User;
  check : string;

  userList : User[];
  scheduleList : Schedule[];
  teamList : Team[];

  teamControl;

  constructor(
    private jwtService : JwtService,
    private userService : UserService,
    private scheduleService : ScheduleService,
    private teamService : TeamService
  ) { }

  ngOnInit(): void {
    this.check = localStorage.getItem("AUTH_TOKEN");

    if(this.check != null){
       
      this.loginUser = this.jwtService.decodeToUser(this.check);
      
    }else{
      this.check= sessionStorage.getItem("AUTH_TOKEN");

      if(this.check != null){
        this.loginUser = this.jwtService.decodeToUser(this.check);
      }
    }

    this.userService.selectUserList().subscribe(res => {//같은 팀 유저 리스트
      this.userList = res.data.filter((user) => user.team == this.loginUser.team);
    });

    this.scheduleService.selectScheduleList().subscribe(res => {
      this.scheduleList = res.data.filter((user) => user.team == this.loginUser.team);

      //스케쥴 개수 설정
      for (let i = 0; i < this.userList.length; i++) {
        const user = this.userList[i];
        user.count = this.scheduleList.filter((schedule) => schedule.writer == user.id).length;
      }
    });

    this.teamService.selectTeamList().subscribe(res => {
      this.teamList = res.data.team;
    });

    this.teamControl = new FormControl(this.loginUser.team);
  }

  changeTeam(){
    this.userService.selectUserList().subscribe(res => {//선택한 팀 유저 리스트
      this.userList = res.data.filter((user) => user.team == this.teamControl.value);
    });

    this.scheduleService.selectScheduleList().subscribe(res => {
      this.scheduleList = res.data.filter((user) => user.team == this.teamControl.value);

      //스케쥴 개수 설정
      for (let i = 0; i < this.userList.length; i++) {
        const user = this.userList[i];
        user.count = this.scheduleList.filter((schedule) => schedule.writer == user.id).length;
      }
    });
  }

}

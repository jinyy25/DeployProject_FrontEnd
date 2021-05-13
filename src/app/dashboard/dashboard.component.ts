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
  teamUser : User[];

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

    this.scheduleService.selectTodayCount().subscribe(res => {//같은 팀 유저 리스트
      this.userList = res.data;
      this.teamUser = res.data.filter((user) => user.team == this.loginUser.team);
    });

    this.teamService.selectTeamList().subscribe(res => {
      this.teamList = res.data.team;
    });

    this.teamControl = new FormControl(this.loginUser.team);
  }

  changeTeam(){//선택한 팀 유저리스트
    this.teamUser = this.userList.filter((user) => user.team == this.teamControl.value);
  }

}

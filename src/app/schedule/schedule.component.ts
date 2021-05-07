import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FullCalendarComponent, CalendarOptions } from '@fullcalendar/angular';
import { EventApi, EventInput } from '@fullcalendar/core';
import enLocale from '@fullcalendar/core/locales/en-au';
import koLocale from '@fullcalendar/core/locales/ko';
import { InsertScheduleComponent } from './insert-schedule/insert-schedule.component';
import { User } from '../models/user.model';
import { JwtService } from '../services/jwt.service';
import { ScheduleService } from '../services/schedule.service';
import { UpdateScheduleComponent } from './update-schedule/update-schedule.component';
import { TeamService } from '../services/team.service';
import { Team } from '../models/team.model';
import { ScheduleHistory } from '../models/schedule-history.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements AfterViewInit {

  //로그인 회원 아이디 정보
  loginUser : User;
  check : string;
  //팀 정보
  teamList : Team[];
  colorArray = ['pink', 'orange', 'lightgreen', 'purple', 'navy', 'black', 'red', 'violet', 'yellowgreen'];

  ngOnInit() {
    this.check = localStorage.getItem("AUTH_TOKEN");

    if(this.check !=null){
       
      this.loginUser = this.jwtService.decodeToUser(this.check);
      
    }else{
      this.check= sessionStorage.getItem("AUTH_TOKEN");

      if(this.check !=null){
        this.loginUser = this.jwtService.decodeToUser(this.check);
      }
    }

    this.teamService.selectTeamList().subscribe(res => {
      this.teamList = res.data.team;
    });

  }

  events : EventInput[] = [];

  @ViewChild('calendar') calendar : FullCalendarComponent;

  constructor(
    private dialog : MatDialog,
    private service : ScheduleService,
    private pipe: DatePipe,
    private jwtService : JwtService,
    private teamService : TeamService
  ) {}

  calendarOptions : CalendarOptions = {
    locales:[enLocale, koLocale],
    locale: 'ko',//한국어
    displayEventTime: false,
    headerToolbar: {
      left: 'prev,next today all,team,one',
      center: 'title',
      right: 'listMonth dayGridMonth,timeGridWeek,timeGridDay'
    },
    customButtons: {
      all: {
        text: '전체',
        click: () => this.showAll()
      },
      team: {
        text: '팀',
        click: () => this.showMyTeam()
      },
      one: {
        text: '개인',
        click: () => this.showOne()
      }
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,                //event longclick 시, draggable과 resizing(date range 변경)이 가능하게 함(기본값 : false)
    eventDurationEditable: true,  //resize 가능
    eventStartEditable: true,      //드래그 가능
    selectable: true,              //long click, long click & drag를 해야만, select가 이루어지고, select callback 반환 // 날짜 배경 Highlight 및 Range 선택가능
    eventOverlap: true,            //해당 날짜에 하나이상의 과업이 있어도, drop 가능(기본값 : true)
    eventLongPressDelay: 1000,     //event가 draggable 하게 만들기 위해 걸리는 시간(기본값 : 1초)
    selectLongPressDelay: 1000,    //date가 select 하게 만들기 위해 걸리는 시간(기본값 : 1초)
    // longPressDelay : 1000       //위에 두개를 합친것
    dayMaxEvents: true,            //하루에 일정 많을때 +버튼으로 표시
    // eventBackgroundColor: 'red',   //기본값 배경색상 적용
    // eventTextColor: 'white',         //기본값 글자색상 적용
    eventChange: this.handleEventChange.bind(this),
    //dateClick: this.handleDateClick.bind(this), //date short click
    select: this.handleDateSelect.bind(this),   //date long click
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    height: '90vh'
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };

  ngAfterViewInit(){
    //let calendarApi = this.calendar.getApi();
    this.service.selectScheduleList().subscribe(data => {
      data.forEach(element => {

        let endDate = element.endDate;

        if(element.startDate.length == 10 && element.endDate.length == 10){
          const end = new Date(element.endDate);
          end.setDate(end.getDate() + 1);
          endDate = this.pipe.transform(end, 'yyyy-MM-dd');
        }

        const edit = element.complete != 'Y' && element.writer == this.loginUser.id;//완료되지 않은 일정, 내가 작성한 일정만 이동 가능 = true
        let color;

        for (let i = 0; i < this.teamList.length; i++) {
          if(element.team == this.teamList[i].codeName){
            color = this.colorArray[i];
          }
        }

        if(element.writer == this.loginUser.id){
          color = 'default';
        }
        if(element.complete == 'Y'){//완료된 일정은 회색
          color = 'grey';
        }

        this.events.push({
          id : String(element.scheduleNo),
          title : element.scheduleTitle,
          start : element.startDate,
          end : endDate,
          schedule : element,
          startEditable : edit,
          durationEditable : edit,
          color : color
        });
      });
      this.calendarOptions.events = this.events;
    });
  }

  //이벤트 클릭시 수정, 삭제
  handleEventClick(arg) {
    this.openUpdate(arg);
  }

  //이벤트 드래그, resize
  handleEventChange(arg) {
    if(confirm("일정을 수정하시겠습니까?")){
      const newEvent = arg.event;//드래그한 후의 날짜
      const schedule = newEvent.extendedProps.schedule;

      if(newEvent.allDay){//종일

        schedule.startDate = this.pipe.transform(newEvent.start, 'yyyy-MM-dd');
        const end = new Date(newEvent.end);
        end.setDate(newEvent.end.getDate() - 1);
        schedule.endDate = this.pipe.transform(end, 'yyyy-MM-dd');
        
      }else{//시간 있으면
        
        schedule.startDate = this.pipe.transform(newEvent.start, 'yyyy-MM-dd HH:mm');
        if(newEvent.end == null){//종일에서 시간으로 옮기면 값 null
          const end = new Date(newEvent.start);
          end.setHours(newEvent.start.getHours() + 1);
          schedule.endDate = this.pipe.transform(end, 'yyyy-MM-dd HH:mm');
        }else{
          schedule.endDate = this.pipe.transform(newEvent.end, 'yyyy-MM-dd HH:mm');
        }

      }

      this.service.updateSchedule(schedule).subscribe(data => {
        if(data > 0){
          alert("일정을 수정하였습니다");
        }else{
          alert("수정에 실패하였습니다");
        }
      });

    }else{//수정 안함
      window.location.reload();
    }
  }

  // 날짜를 선택한 경우
  handleDateSelect(arg) {//dateClick이랑 중복
    //모달창 띄우기
    this.openDialog(arg);
  }

  openDialog(arg) : void{//모달창 띄움
    const dialogRef = this.dialog.open(InsertScheduleComponent, {
      //open 메소드는 dialogRef를 리턴
      width : '530px',
      data : {startDate : arg.start, endDate : arg.end, allDay : arg.allDay, name : this.loginUser.name}//날짜, 시간 전해줘야됨
    });

    dialogRef.afterClosed().subscribe( result => {//onSave 메소드에서 리턴한 schedule 객체
      console.log(result);
      //const calendarApi = arg.view.calendar;
      result.writer = this.loginUser.id;

      if(!result.allDay){//시간 있으면 날짜, 시간 합쳐줌
        result.startDate = result.startDate+" "+result.startTime;
        result.endDate = result.endDate+" "+result.endTime;
      }

      this.service.insertSchedule(result).subscribe(data => {
        if(data > 0){
          alert("일정이 등록되었습니다");
        }else{
          alert("등록에 실패하였습니다");
        }
        window.location.reload();//새로고침
      });
    });
  }

  openUpdate(arg) : void{
    //arg.event = EventApi
    const disable = this.loginUser.id != arg.event.extendedProps.schedule.writer;//로그인 유저가 일정 작성자가 아닐 경우
    
    const dialogRef = this.dialog.open(UpdateScheduleComponent, {
      //open 메소드는 dialogRef를 리턴
      width : '530px',
      data : {
        scheduleNo : arg.event.extendedProps.schedule.scheduleNo,
        scheduleTitle : arg.event.title,
        scheduleContent : arg.event.extendedProps.schedule.scheduleContent,
        name : arg.event.extendedProps.schedule.name,
        startDate : arg.event.start,
        endDate : arg.event.end,
        allDay : arg.event.allDay,
        complete : arg.event.extendedProps.schedule.complete,
        disable : disable,
        team : arg.event.extendedProps.schedule.team
      }
    });

    dialogRef.afterClosed().subscribe( result => {

      if(result.delete == 'delete'){//삭제

        this.service.deleteSchedule(arg.event.extendedProps.schedule.scheduleNo, result.reason).subscribe(data => {
          if(data > 0){
            alert("일정을 삭제하였습니다");
            arg.event.remove();
          }else{
            alert("삭제에 실패하였습니다")
          }
        });

      }else if(result){//수정

        if(!result.allDay){//시간 있으면 날짜, 시간 합쳐줌
          result.startDate = result.startDate+" "+result.startTime;
          result.endDate = result.endDate+" "+result.endTime;
        }
        
        this.service.updateSchedule(result).subscribe(data => {
          if(data > 0){
            alert("일정을 수정하였습니다");
          }else{
            alert("수정에 실패하였습니다")
          }
          window.location.reload();
        });
      }
    });
  }

  currentEvents: EventApi[] = [];//화면에 있는 모든 일정

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  showAll(){//전체 스케쥴 보여주기
    this.calendarOptions.events = this.events;
  }

  showMyTeam(){//본인 팀 보여주기
    const teamEvent = this.events.filter((event) => event.schedule.team == this.loginUser.team);
    this.calendarOptions.events = teamEvent;
  }

  showOne(){//자기꺼 보여주기
    const oneEvent = this.events.filter((event) => event.schedule.writer == this.loginUser.id);
    this.calendarOptions.events = oneEvent;
  }

  showTeam(team){//색상 안내도 눌렀을때 팀별 보여주기
    const teamEvent = this.events.filter((event) => event.schedule.team == team.codeName);
    this.calendarOptions.events = teamEvent;
  }

  teamColor(team, i){//색상 안내도에 팀 색 입혀주기
    team.style.backgroundColor = this.colorArray[i];
    team.style.borderRadius = "3px";
  }
}


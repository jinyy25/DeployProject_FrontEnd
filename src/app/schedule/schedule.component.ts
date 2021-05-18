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
import { SearchScheduleComponent } from './search-schedule/search-schedule.component';
import { UserService } from '../services/user.service';
import icChevronLeft from '@iconify/icons-ic/twotone-chevron-left';
import icChevronRight from '@iconify/icons-ic/twotone-chevron-right';
import { dropdownAnimation } from 'src/@vex/animations/dropdown.animation';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  animations: [dropdownAnimation]
})
export class ScheduleComponent implements AfterViewInit {
  @ViewChild('calendar') calendar : FullCalendarComponent;

  //로그인 회원 아이디 정보
  loginUser : User;
  check : string;
  //팀 정보
  teamList : Team[];
  colorArray = ['pink', 'orange', 'yellowgreen', 'purple', 'navy', 'black', 'red', 'violet', 'lightgreen'];
  userList : User[];

  viewDate;
  icChevronLeft = icChevronLeft;
  icChevronRight = icChevronRight;

  toggle = false;
  
  ngOnInit() {
    this.check = localStorage.getItem("AUTH_TOKEN");

    if(this.check !=null){
      this.loginUser = this.jwtService.decodeToUser(this.check);
    }

    this.teamService.selectTeamList().subscribe(res => {
      this.teamList = res.data.team;
    });

    this.userService.selectUserList().subscribe(res => {
      this.userList = res.data;
    });
  }

  events : EventInput[] = [];

  constructor(
    private dialog : MatDialog,
    private service : ScheduleService,
    private pipe: DatePipe,
    private jwtService : JwtService,
    private teamService : TeamService,
    private userService : UserService
  ) {}

  calendarOptions : CalendarOptions = {
    locales:[enLocale, koLocale],
    locale: 'ko',//한국어
    displayEventTime: false,
    headerToolbar: false,
    initialView: 
    localStorage.getItem("calendarView") !== null ? localStorage.getItem("calendarView") : "dayGridMonth",//마지막으로 저장된 view
    datesSet: function(info){//view 바뀌면 local storage에 저장
      localStorage.setItem("calendarView", info.view.type);
    },
    weekends: true,
    editable: true,                //event longclick 시, draggable과 resizing(date range 변경)이 가능하게 함(기본값 : false)
    eventDurationEditable: true,  //resize 가능
    eventStartEditable: true,      //드래그 가능
    eventResizableFromStart: true,
    selectable: true,              //long click, long click & drag를 해야만, select가 이루어지고, select callback 반환 // 날짜 배경 Highlight 및 Range 선택가능
    dayMaxEvents: true,            //하루에 일정 많을때 +버튼으로 표시
    views:{
      timeGrid:{
        dayMaxEvents : 1
      }
    },
    eventChange: this.handleEventChange.bind(this),
    select: this.handleDateSelect.bind(this),   //date long click
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    height: '90vh'
  };

  ngAfterViewInit(){
    //let calendarApi = this.calendar.getApi();

    this.service.selectScheduleList().subscribe(res => {
      res.data.forEach(element => {

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

    setTimeout(() => this.viewDate = this.calendar.getApi().currentData.viewTitle);//ChangeDetectorRef 써도 됨
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

      this.service.updateSchedule(schedule).subscribe(res => {
        if(res.data){
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
      //const calendarApi = arg.view.calendar;
      if(result){
        result.writer = this.loginUser.id;

        if(!result.allDay){//시간 있으면 날짜, 시간 합쳐줌
          result.startDate = result.startDate+" "+result.startTime;
          result.endDate = result.endDate+" "+result.endTime;
        }

        this.service.insertSchedule(result).subscribe(res => {
          if(res.data){
            alert("일정이 등록되었습니다");
          }else{
            alert("등록에 실패하였습니다");
          }
          window.location.reload();//새로고침
        });
      }
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
      if(result){
        if(result.delete == 'delete'){//삭제

          this.service.deleteSchedule(arg.event.extendedProps.schedule.scheduleNo, result.reason).subscribe(res => {
            if(res.data){
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
          
          this.service.updateSchedule(result).subscribe(res => {
            if(res.data){
              alert("일정을 수정하였습니다");
            }else{
              alert("수정에 실패하였습니다")
            }
            window.location.reload();
          });
        }
      }
    });
  }

  currentEvents: EventApi[] = [];//화면에 있는 모든 일정

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  showAll(){//전체 스케쥴 보여주기
    this.calendarOptions.events = this.events;

    if(this.toggle){//팀별 안 보이게
      this.toggle = !this.toggle;
    }
  }

  showMyTeam(){//색상 안내도 토글
    this.toggle = !this.toggle;
  }

  showOne(){//자기꺼 보여주기, 개인별 검색
    if(this.toggle){//팀별 안 보이게
      this.toggle = !this.toggle;
    }

    const dialogRef = this.dialog.open(SearchScheduleComponent, {
      //팀별 유저 리스트 보내주기, 본인 정보 보내주기
      width : '400px',
      data : {
        teamList : this.teamList,
        userList : this.userList,
        loginUser : this.loginUser
      }
    });

    dialogRef.afterClosed().subscribe( result => {//id 전달
      if(result){
        if(result.length == 1){
          const oneEvent = this.events.filter((event) => event.schedule.writer == result);
          this.calendarOptions.events = oneEvent; 
        }else{
          let array = [];
          for (let i = 0; i < result.length; i++) {
            if(i == 0){//맨 처음 event list
              array = this.events.filter((event) => event.schedule.writer == result[i]);
            }else{
              const oneEvent = this.events.filter((event) => event.schedule.writer == result[i]);
              array = array.concat(oneEvent);
            }
          }
          this.calendarOptions.events = array;
        }
      }
    });
  }

  showTeam(team){//색상 안내도 눌렀을때 팀별 보여주기
    const teamEvent = this.events.filter((event) => event.schedule.team == team.codeName);
    this.calendarOptions.events = teamEvent;

    this.toggle = !this.toggle;//팀 안내도 닫히게
  }

  teamColor(team, i){//색상 안내도에 팀 색 입혀주기
    team.style.backgroundColor = this.colorArray[i];
    team.style.borderRadius = "3px";
  }

  showMine(){//진행 중인 본인 일정 보이게
    const myEvent = this.events.filter((event) => event.schedule.writer == this.loginUser.id && event.schedule.complete != 'Y');
    this.calendarOptions.events = myEvent;

    this.toggle = !this.toggle;//팀 안내도 닫히게
  }

  showEnd(){//완료 일정 보이게
    const endEvent = this.events.filter((event) => event.schedule.complete == 'Y');
    this.calendarOptions.events = endEvent;

    this.toggle = !this.toggle;//팀 안내도 닫히게
  }

  showMonth(){//월
    this.calendar.getApi().changeView('dayGridMonth');
    this.viewDate = this.calendar.getApi().currentData.viewTitle;
  }

  showWeek(){//주
    this.calendar.getApi().changeView('dayGridWeek');
    this.viewDate = this.calendar.getApi().currentData.viewTitle;
  }

  showDay(){//일
    this.calendar.getApi().changeView('timeGridDay');
    this.viewDate = this.calendar.getApi().currentData.viewTitle;
  }

  showPrev(){//이전 날짜
    this.calendar.getApi().prev();
    this.viewDate = this.calendar.getApi().currentData.viewTitle;
  }

  showNext(){//이후 날짜
    this.calendar.getApi().next();
    this.viewDate = this.calendar.getApi().currentData.viewTitle;
  }

  showToday(){//오늘 날짜
    this.calendar.getApi().today();
    this.viewDate = this.calendar.getApi().currentData.viewTitle;
  }

}


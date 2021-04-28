import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FullCalendarComponent, CalendarOptions } from '@fullcalendar/angular';
import { EventApi, EventInput } from '@fullcalendar/core';
import enLocale from '@fullcalendar/core/locales/en-au';
import koLocale from '@fullcalendar/core/locales/ko';
import { InsertScheduleComponent } from '../insert-schedule/insert-schedule.component';
import { ScheduleService } from '../services/schedule.service';
import { UpdateScheduleComponent } from '../update-schedule/update-schedule.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements AfterViewInit {

  events : EventInput[] = [];

  @ViewChild('calendar') calendar : FullCalendarComponent;

  constructor(private dialog : MatDialog, private service : ScheduleService, private pipe: DatePipe) {}

  calendarOptions : CalendarOptions = {
    locales:[enLocale, koLocale],
    locale: 'ko',//한국어
    displayEventTime: false,
    headerToolbar: {
      left: 'prev,next today listMonth',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    initialView: 'dayGridMonth',
    //initialEvents: [],
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
    eventDrop: this.handleEventDrop.bind(this),
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

  ngAfterViewInit(){//startEditable : false, durationEditable 설정해줘야함
    //let calendarApi = this.calendar.getApi();
    this.service.selectSchedule().subscribe(data => {
      data.forEach(element => {
        let endDate = element.endDate;
        if(element.startDate.length == 10 && element.endDate.length == 10){
          const end = new Date(element.endDate);
          end.setDate(end.getDate() + 1);
          endDate = this.pipe.transform(end, 'yyyy-MM-dd');
        }
        this.events.push({
          id : String(element.scheduleNo),
          title : element.scheduleTitle,
          start : element.startDate,
          end : endDate,
          schedule : element
        });
      });
      this.calendarOptions.events = this.events;
    });
  }

  //이벤트 클릭시 수정, 삭제
  handleEventClick(arg) {
    this.openUpdate(arg);
  }

  //이벤트 드래그 해서 이동
  handleEventDrop(arg) {//얘도 수정해줘야함
    const newEvent = arg.event;//드래그한 후의 날짜
    const oldEvent = arg.oldEvent;//드래그 전의 날짜
  }

  // 날짜를 선택한 경우
  handleDateSelect(arg) {//dateClick이랑 중복
    //모달창 띄우기
    this.openDialog(arg);
  }

  openDialog(arg) : void{//모달창 띄움
    const dialogRef = this.dialog.open(InsertScheduleComponent, {
      //open 메소드는 dialogRef를 리턴
      width : '450px',
      data : {startDate : arg.start, endDate : arg.end, allDay : arg.allDay}//날짜, 시간 전해줘야됨
    });

    dialogRef.afterClosed().subscribe( result => {//onSave 메소드에서 리턴한 schedule 객체
      const calendarApi = arg.view.calendar;

      if(result.allDay){//하루 종일
        const endDate = new Date(result.endDate);
        endDate.setDate(endDate.getDate() + 1);//endDate 하루 늘려줌
        calendarApi.addEvent({
          id: String(Math.random()),
          title: result.scheduleTitle,
          start: result.startDate,
          end: endDate,
          allDay: result.allDay,
          schedule : result
        });
        this.service.createSchedule(result).subscribe(data => {
          alert("일정 등록");
        });
      }else{//시간 있을때
        const startDate = new Date(result.startDate+"T"+result.startTime+':00');
        const endDate = new Date(result.endDate+"T"+result.endTime+':00');
        calendarApi.addEvent({
          id: String(Math.random()),
          title: result.scheduleTitle,
          start: startDate,
          end: endDate,
          allDay: result.allDay,
          schedule : result
        });
        //날짜 시간 합쳐줘야함
        result.startDate = result.startDate+" "+result.startTime;
        result.endDate = result.endDate+" "+result.endTime;
        this.service.createSchedule(result).subscribe(data => {
          alert("일정 등록");
        });
      }
    });
  }

  openUpdate(arg) : void{
    //arg.event = EventApi
    const dialogRef = this.dialog.open(UpdateScheduleComponent, {
      //open 메소드는 dialogRef를 리턴
      width : '450px',
      data : {
        scheduleTitle : arg.event.title,
        scheduleContent : arg.event.extendedProps.schedule.scheduleContent,
        startDate : arg.event.start,
        endDate : arg.event.end,
        allDay : arg.event.allDay,
        complete : arg.event.extendedProps.schedule.complete
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      if(result == 'delete'){//삭제
        arg.event.remove();
        this.service.deleteSchedule(arg.event.extendedProps.schedule.scheduleNo).subscribe(data => {
          alert("일정 삭제");
        });

      }else if(result){//수정
        const calendarApi = arg.view.calendar;
        arg.event.remove();

        if(result.allDay){//하루 종일
          const endDate = new Date(result.endDate);
          endDate.setDate(endDate.getDate() + 1);//endDate 하루 늘려줌
          //arg.event.setProp('title', result.scheduleTitle);
          calendarApi.addEvent({
            id: String(Math.random()),
            title: result.scheduleTitle,
            start: result.startDate,
            end: endDate,
            allDay: result.allDay,
            schedule : result
          });
        }else{//시간 있을때
          const startDate = new Date(result.startDate+"T"+result.startTime+':00');
          const endDate = new Date(result.endDate+"T"+result.endTime+':00');
          calendarApi.addEvent({
            title: result.scheduleTitle,
            start: startDate,
            end: endDate,
            allDay: result.allDay,
            schedule : result
          });
        }
      }
    });
  }

  currentEvents: EventApi[] = [];//화면에 있는 모든 일정

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
}

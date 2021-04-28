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
        let edit = true;
        if(element.complete == 'Y'){
          edit = false;
        }
        this.events.push({
          id : String(element.scheduleNo),
          title : element.scheduleTitle,
          start : element.startDate,
          end : endDate,
          schedule : element,
          startEditable : edit,
          durationEditable : edit
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
          alert("일정 수정");
        }else{
          alert("수정 실패")
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
      width : '450px',
      data : {startDate : arg.start, endDate : arg.end, allDay : arg.allDay}//날짜, 시간 전해줘야됨
    });

    dialogRef.afterClosed().subscribe( result => {//onSave 메소드에서 리턴한 schedule 객체
      //const calendarApi = arg.view.calendar;

      this.service.createSchedule(result).subscribe(data => {
        if(data > 0){
          alert("일정 등록");
        }else{
          alert("등록 실패");
        }
        window.location.reload();//새로고침
      });
    });
  }

  openUpdate(arg) : void{
    //arg.event = EventApi
    const dialogRef = this.dialog.open(UpdateScheduleComponent, {
      //open 메소드는 dialogRef를 리턴
      width : '450px',
      data : {
        scheduleNo : arg.event.extendedProps.schedule.scheduleNo,
        scheduleTitle : arg.event.title,
        scheduleContent : arg.event.extendedProps.schedule.scheduleContent,
        writer : arg.event.extendedProps.schedule.writer,
        startDate : arg.event.start,
        endDate : arg.event.end,
        allDay : arg.event.allDay,
        complete : arg.event.extendedProps.schedule.complete
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      if(result == 'delete'){//삭제

        this.service.deleteSchedule(arg.event.extendedProps.schedule.scheduleNo).subscribe(data => {
          if(data > 0){
            alert("일정 삭제");
            arg.event.remove();
          }else{
            alert("삭제 실패")
          }
        });

      }else if(result){//수정
        
        this.service.updateSchedule(result).subscribe(data => {
          if(data > 0){
            alert("일정 수정");
          }else{
            alert("수정 실패")
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
}

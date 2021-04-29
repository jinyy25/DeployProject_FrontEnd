import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Schedule } from '../models/schedule.model';

@Component({
  selector: 'app-insert-schedule',
  templateUrl: './insert-schedule.component.html',
  styleUrls: ['./insert-schedule.component.css']
})
export class InsertScheduleComponent implements OnInit{
  schedule : Schedule = new Schedule();

  constructor(private dialogRef : MatDialogRef<InsertScheduleComponent>, @Inject(MAT_DIALOG_DATA) public data: Schedule, private pipe: DatePipe) { }
  ngOnInit(): void {//날짜, 시간, 종일 input 값 세팅
    this.schedule.allDay = this.data.allDay;

    this.schedule.startDate = this.pipe.transform(this.data.startDate, 'yyyy-MM-dd');
    
    if(this.data.allDay){//월에서 선택
      const endDate = new Date(this.pipe.transform(this.data.endDate, 'yyyy-MM-dd'));
      endDate.setDate(endDate.getDate() - 1);
      this.schedule.endDate = this.pipe.transform(endDate, 'yyyy-MM-dd');
    }else{//주, 일에서 선택
      this.schedule.startTime = this.pipe.transform(this.data.startDate, 'HH:mm');
      this.schedule.endDate = this.pipe.transform(this.data.endDate, 'yyyy-MM-dd');
      this.schedule.endTime = this.pipe.transform(this.data.endDate, 'HH:mm');
    }
  }

  onSubmit(){//여기 있는 값 리턴. required 값 적었는지 확인해줘야함
    this.dialogRef.close(this.schedule);
  }

  isDisabled = this.data.allDay;

  disable(){
    this.isDisabled = !this.isDisabled;
  }
}

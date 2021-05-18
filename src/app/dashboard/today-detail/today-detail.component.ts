import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Schedule } from 'src/app/models/schedule.model';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'vex-today-detail',
  templateUrl: './today-detail.component.html',
  styleUrls: ['./today-detail.component.scss']
})
export class TodayDetailComponent implements OnInit {
  schedule;
  scheduleList : Schedule[];//클릭한 사람의 오늘의 일정 리스트

  constructor(
    private dialogRef : MatDialogRef<TodayDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private service : ScheduleService
  ) { }

  ngOnInit(): void {
    this.schedule = new Schedule();
    this.schedule.writer = this.data.user.id;
    this.schedule.complete = this.data.complete;
    this.service.selectTodayList(this.schedule).subscribe(res => {
      this.scheduleList = res.data;
    });
  }

}

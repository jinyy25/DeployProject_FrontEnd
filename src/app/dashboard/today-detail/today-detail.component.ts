import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'vex-today-detail',
  templateUrl: './today-detail.component.html',
  styleUrls: ['./today-detail.component.scss']
})
export class TodayDetailComponent implements OnInit {

  constructor(
    private dialogRef : MatDialogRef<TodayDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private service : ScheduleService
  ) { }

  ngOnInit(): void {
    
  }

}

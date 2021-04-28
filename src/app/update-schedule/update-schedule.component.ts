import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Schedule } from '../models/schedule.model';

@Component({
  selector: 'app-update-schedule',
  templateUrl: './update-schedule.component.html',
  styleUrls: ['./update-schedule.component.css']
})
export class UpdateScheduleComponent implements OnInit {
  schedule : Schedule = new Schedule();

  constructor(private dialogRef : MatDialogRef<UpdateScheduleComponent>, @Inject(MAT_DIALOG_DATA) public data : Schedule, private pipe: DatePipe) { }

  ngOnInit(): void {
    this.schedule.scheduleNo = this.data.scheduleNo;
    this.schedule.allDay = this.data.allDay;

    if(this.data.allDay){//종일
      this.schedule.startDate = this.pipe.transform(this.data.startDate, 'yyyy-MM-dd');
      const endDate = new Date(this.pipe.transform(this.data.endDate, 'yyyy-MM-dd'));
      endDate.setDate(endDate.getDate() - 1);
      this.schedule.endDate = this.pipe.transform(endDate, 'yyyy-MM-dd');
    }else{//시간
      this.schedule.startDate = this.pipe.transform(this.data.startDate, 'yyyy-MM-dd HH:mm');
      this.schedule.endDate = this.pipe.transform(this.data.endDate, 'yyyy-MM-dd HH:mm');
    }
    this.schedule.scheduleTitle = this.data.scheduleTitle;
    this.schedule.scheduleContent = this.data.scheduleContent;
  }

  onCancel(){
    this.dialogRef.close();
  }
  
  onDelete(){
    if(confirm("해당 일정을 삭제하시겠습니까? 삭제 후에는 복구가 불가능합니다.")){
      this.dialogRef.close('delete');
    }
  }

  onUpdate(){
    if(confirm("해당 일정을 수정하시겠습니까?")){
      this.schedule.updateDate = this.pipe.transform(new Date(), 'yyyy-MM-dd');
      this.dialogRef.close(this.schedule);
    }
  }

  onComplete(){
    if(confirm("완료 후에는 수정이 불가능합니다. 계속하시겠습니까?")){
      this.schedule.complete = 'Y';
      this.schedule.completeDate = this.pipe.transform(new Date(), 'yyyy-MM-dd HH:mm');
      this.dialogRef.close(this.schedule);
    }
  }

  isDisabled = this.data.allDay;

  disable(){
    this.isDisabled = !this.isDisabled;
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ScheduleHistory } from '../models/schedule-history.model';
import { Schedule } from '../models/schedule.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ScheduleService{

  private url = '/schedule';

  constructor(private http : HttpClient) { }

  insertSchedule(schedule : Schedule){
    return this.http.post(this.url, schedule);
  }

  selectScheduleList(){
    return this.http.get<Schedule[]>(this.url);
  }

  updateSchedule(schedule : Schedule){
    return this.http.patch(this.url, schedule);
  }

  deleteSchedule(scheduleNo : number, updateReason : string){
    if(updateReason == null || updateReason == ''){
      return this.http.delete(this.url+"/"+scheduleNo);
    }else{
      const schedule = new Schedule();
      schedule.scheduleNo = scheduleNo;
      schedule.updateReason = updateReason;
      return this.http.post(this.url+"/deleteReason", schedule);
    }
  }

  selectHistoryList(scheduleNo : number){
    return this.http.get<ScheduleHistory[]>(this.url+"/history/"+scheduleNo);
  }
}

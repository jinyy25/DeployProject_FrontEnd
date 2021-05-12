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
    return this.http.post<any>(this.url, schedule);
  }

  selectScheduleList(){
    return this.http.get<any>(this.url);
  }

  updateSchedule(schedule : Schedule){
    return this.http.patch<any>(this.url, schedule);
  }

  deleteSchedule(scheduleNo : number, updateReason : string){
    if(updateReason == null || updateReason == ''){
      return this.http.delete<any>(this.url+"/"+scheduleNo);
    }else{
      const schedule = new Schedule();
      schedule.scheduleNo = scheduleNo;
      schedule.updateReason = updateReason;
      return this.http.post<any>(this.url+"/deleteReason", schedule);
    }
  }

  selectHistoryList(scheduleNo : number){
    return this.http.get<any>(this.url+"/history/"+scheduleNo);
  }

  selectTodayCount(){
    return this.http.get<any>(this.url+"/today");
  }
}

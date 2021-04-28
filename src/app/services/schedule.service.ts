import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Schedule } from '../models/schedule.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ScheduleService{

  private url = 'http://localhost:8080';

  constructor(private http : HttpClient) { }

  createSchedule(schedule : Schedule){
    return this.http.post<Schedule>(this.url+"/create", schedule);
  }

  selectSchedule(){
    return this.http.get<Schedule[]>(this.url);
  }

  updateSchedule(schedule : Schedule){
    return this.http.patch<Schedule>(this.url+"/update", schedule);
  }

  deleteSchedule(scheduleNo : number){
    return this.http.delete<Schedule>(this.url+"/delete/"+scheduleNo);
  }
}

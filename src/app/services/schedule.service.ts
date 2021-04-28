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

  private url = '/schedule';

  constructor(private http : HttpClient) { }

  createSchedule(schedule : Schedule){
    return this.http.post(this.url+"/create", schedule);
  }

  selectSchedule(){
    return this.http.get<Schedule[]>(this.url+"/list");
  }

  updateSchedule(schedule : Schedule){
    return this.http.patch(this.url+"/update", schedule);
  }

  deleteSchedule(scheduleNo : number){
    return this.http.delete(this.url+"/delete/"+scheduleNo);
  }
}

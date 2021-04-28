

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VexModule } from '../@vex/vex.module';
import { HttpClientModule } from '@angular/common/http';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';
import { NgxPaginationModule } from 'ngx-pagination';//for pagination

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

import { MatDialogModule } from '@angular/material/dialog';//모달
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsertScheduleComponent } from './insert-schedule/insert-schedule.component';
import { UpdateScheduleComponent } from './update-schedule/update-schedule.component';
import { ScheduleService } from './services/schedule.service';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleModule } from './schedule/schedule.module';
import { DatePipe } from '@angular/common';




//common sample용
import { UserService } from './common/pagination/user.service';
import { UserComponent } from './common/pagination/user.component';
import { UserExcelService } from './common/excel-download/userExcel.service';
import { ExcelComponent } from './common/excel-download/excel.component';
import { ExcelService } from './common/excel-download/excel.service';
import { UploadFilesComponent } from './common/file-upload/upload-files.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin,
  listPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    ScheduleComponent,
    InsertScheduleComponent,
    UpdateScheduleComponent,


    
    
    
    
    
    //pagination sample용 Component
    UserComponent,
    ExcelComponent,
    UploadFilesComponent
  
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxPaginationModule,//for pagination

    // Vex
    VexModule,
    CustomLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    MatDialogModule,//modal
    ScheduleModule,
  ],
  entryComponents: [//dialog 동적으로 생성. component factory에 추가됨
    InsertScheduleComponent,
    UpdateScheduleComponent
  ],
  providers: [
    ScheduleService,
    DatePipe,





    //common sample용
    UserService,
    UserExcelService,
    ExcelService
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

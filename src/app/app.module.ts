import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VexModule } from '../@vex/vex.module';
import { HttpClientModule } from '@angular/common/http';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';
import { NgxPaginationModule } from 'ngx-pagination';//for pagination

import { ScheduleService } from './services/schedule.service';
import { DatePipe } from '@angular/common';




//common sample용
import { UserService } from './common/pagination/user.service';
import { UserComponent } from './common/pagination/user.component';
import { UserExcelService } from './common/excel-download/userExcel.service';
import { ExcelComponent } from './common/excel-download/excel.component';
import { ExcelService } from './common/excel-download/excel.service';
import { UploadFilesComponent } from './common/file-upload/upload-files.component';

@NgModule({
  declarations: [
    AppComponent,


    
    
    
    
    
    //pagination sample용 Component
    UserComponent,
    ExcelComponent,
    UploadFilesComponent,
  
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxPaginationModule,//for pagination

    // Vex
    VexModule,
    CustomLayoutModule
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

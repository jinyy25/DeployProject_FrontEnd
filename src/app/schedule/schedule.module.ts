import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { ScheduleComponent } from './schedule.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { InsertScheduleComponent } from './insert-schedule/insert-schedule.component';
import { UpdateScheduleComponent } from './update-schedule/update-schedule.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ScheduleDirective } from './schedule.directive';
import { MomentDateModule } from '@angular/material-moment-adapter';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin,
  listPlugin
]);

@NgModule({
  declarations: [
    ScheduleComponent,
    InsertScheduleComponent,
    UpdateScheduleComponent,
    ScheduleDirective
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    ScheduleRoutingModule,
    FullCalendarModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,//modal
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MomentDateModule
  ],
  entryComponents: [//dialog 동적으로 생성. component factory에 추가됨
    InsertScheduleComponent,
    UpdateScheduleComponent
  ],
})
export class ScheduleModule { }

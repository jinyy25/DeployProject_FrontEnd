import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeployListComponent } from './deploy-list.component';
import { DeployListRoutingModule } from './deploy-list-routing.module';

import { PageLayoutModule } from '../../@vex/components/page-layout/page-layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbsModule } from '../../@vex/components/breadcrumbs/breadcrumbs.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { IconModule } from '@visurel/iconify-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContainerModule } from '../../@vex/directives/container/container.module';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { DeployDetailComponent } from './deploy-detail/deploy-detail.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MomentDateModule } from '@angular/material-moment-adapter';
import {MatDatepickerModule} from '@angular/material/datepicker';

@NgModule({
  declarations: [DeployListComponent],
  imports: [
    CommonModule,
    DeployListRoutingModule,        
    PageLayoutModule,
    FlexLayoutModule,
    BreadcrumbsModule,    
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    IconModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ContainerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonToggleModule,
    NgxPaginationModule,
    MomentDateModule,
    MatDatepickerModule,
  ]
})
export class DeployListModule { }

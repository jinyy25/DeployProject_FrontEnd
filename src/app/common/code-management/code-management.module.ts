import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { ContainerModule } from 'src/@vex/directives/container/container.module';



import { InsertUpdateCodeComponent } from './insert-update-code-management/insert-update-code/insert-update-code.component';
import { CodeManagementComponent } from './code-management.component';





@NgModule({
  declarations: [
    CodeManagementComponent,
    InsertUpdateCodeComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,//modal
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatNativeDateModule,
    PageLayoutModule,
    FlexLayoutModule,
    BreadcrumbsModule,
    ContainerModule
    
  ],
  entryComponents: [//dialog로 쓰일 component는 entryComponent로 선언해주어야 에러가 발생하지 않음
    InsertUpdateCodeComponent
  ],
})
export class CodeManagementModule { }

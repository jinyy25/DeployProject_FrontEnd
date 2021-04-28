

import { NgModule } from '@angular/core';
import { CustomLayoutComponent } from './custom-layout/custom-layout.component';

import { RouterModule } from '@angular/router';
import { VexRoutes } from '../@vex/interfaces/vex-route.interface';


/*
common pagination `sample component
*/
import { UserComponent } from './common/pagination/user.component';
import { ExcelComponent } from './common/excel-download/excel.component';
import { UploadFilesComponent } from './common/file-upload/upload-files.component';
import { ScheduleComponent } from './schedule/schedule.component';


const routes: VexRoutes = [
  {
    path: '',
    component: CustomLayoutComponent,
    children: [
      {
        path:'deploy-list',
        loadChildren:() => import('./deploy-list/deploy-list.module').then(m => m.DeployListModule),
      }
    ]
  },
  {
    path:'register',
   loadChildren: () => import('./register/register.module').then(m => m.RegisterModule),   
  },
  {
    path:'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  {
    path : 'schedule', component : ScheduleComponent
  }






  /*
  common sample code용 route 설정
  */
  { 
    path: 'sampleUserList', component: UserComponent 
  },
  { 
    path: 'sampleExcelDownload', component: ExcelComponent 
  },
  { 
    path: 'sampleFileUpload', component: UploadFilesComponent 
  }
];



@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

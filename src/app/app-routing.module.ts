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
import { CodeManagementComponent } from './common/code-management/code-management.component';
import { AuthGuardService } from './services/auth-guard.service';


const routes: VexRoutes = [
  {
    path: '',
    component: CustomLayoutComponent,
    canActivate:[AuthGuardService],
    children: [
      {
        path:'',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path:'deploy-list',
        loadChildren:() => import('./deploy-list/deploy-list.module').then(m => m.DeployListModule),
      },
      {
        path:'notice',
        children:[
          {
            path:'',
            loadChildren:() => import('./notice/notice.module').then(m => m.NoticeModule),
          }
        ]
      },
      {
        path : 'schedule',
        loadChildren:() => import('./schedule/schedule.module').then(m => m.ScheduleModule)
      }
    /*
      {
        path : 'code-management',
        children:[
          {
            path:'',
            loadChildren:() => import('./common/code-management/code-management.module').then(m => m.CodeManagementModule)
          }
        ]
        
      }*/
    
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
    path:'mypage',
    canActivate:[AuthGuardService],
    loadChildren: () => import('./mypage/mypage.module').then(m => m.MypageModule),
  },
  {
    path:'password',
    canActivate:[AuthGuardService],
    loadChildren: () => import('./password/password.module').then(m => m.PasswordModule),
  },
  {
    path:'forgot-id',
    loadChildren: () => import('./forgot-id/forgot-id.module').then(m => m.ForgotIdModule),
  },
  {
    path:'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then(m=> m.ForgotPasswordModule),
  },




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
  },
  { 
    path: 'code-management', component: CodeManagementComponent 
  }
];



@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled',
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

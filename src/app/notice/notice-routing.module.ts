import { NgModule } from '@angular/core';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { NoticeComponent } from './notice.component';
import { RouterModule } from '@angular/router';
import { QuicklinkModule } from 'ngx-quicklink';
import { NoticeWriteFormComponent } from './notice-write-form/notice-write-form.component';

const routes: VexRoutes = [
  {
    path:'',
    component: NoticeComponent
  },
  {
    path: 'write',
    component:NoticeWriteFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, QuicklinkModule]
})
export class NoticeRoutingModule { }

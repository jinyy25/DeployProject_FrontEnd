import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuicklinkModule } from 'ngx-quicklink';
import { DeployListComponent } from './deploy-list.component';
import { VexRoutes } from '../../@vex/interfaces/vex-route.interface';
import { DeployWriteFormComponent } from './deploy-write-form/deploy-write-form.component';
import { DeployDetailComponent } from './deploy-detail/deploy-detail.component';
import { DefaultPathComponent } from './default-path/default-path.component';

const routes: VexRoutes = [
  {
    path: '',
    component: DeployListComponent
  },
  {
    path:'deploy-write',
    component:DeployWriteFormComponent
  },
  {
    path:':deployNo',
    component:DeployDetailComponent
  },
  {
    path:'/default-path',
    component : DefaultPathComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, QuicklinkModule]
})
export class DeployListRoutingModule { }

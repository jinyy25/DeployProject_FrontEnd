import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuicklinkModule } from 'ngx-quicklink';
import { DeployListComponent } from './deploy-list.component';
import { VexRoutes } from '../../@vex/interfaces/vex-route.interface';

const routes: VexRoutes = [
  {
    path: '',
    component: DeployListComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, QuicklinkModule]
})
export class DeployListRoutingModule { }

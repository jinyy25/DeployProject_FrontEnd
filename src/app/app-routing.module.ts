import { NgModule } from '@angular/core';
import { CustomLayoutComponent } from './custom-layout/custom-layout.component';

import { RouterModule } from '@angular/router';
import { VexRoutes } from '../@vex/interfaces/vex-route.interface';

const routes: VexRoutes = [
  {
    path: '',
    component: CustomLayoutComponent,
    children: []
  },
  {
    path:'register',
   loadChildren: () => import('./register/register.module').then(m => m.RegisterModule),   
  },
  {
    path: '',
    component: CustomLayoutComponent,
    children:[
      {
        path:'deploy-list',
        loadChildren:() => import('./deploy-list/deploy-list.module').then(m => m.DeployListModule),
      }   
    ]
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

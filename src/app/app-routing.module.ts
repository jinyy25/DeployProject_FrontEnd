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
<<<<<<< HEAD
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
=======
   loadChildren: () => import('./register/register.module').then(m => m.RegisterModule),
   
  },
  {
    path:'login',
    loadChildren:() =>import('./login/login.module').then(m=>m.LoginModule),
>>>>>>> 9d3e5345c0a2af36f3a9ee365bc38bc9914b4a37
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

import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './route-guards/auth.guard';
import {NegateAuthGuard} from './route-guards/negate-auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('../menu/menu.module').then(m => m.MenuModule),
    canActivate: [AuthGuard],
    data: {
      authFailRedirection: '/auth'
    }
  },
  {
    path: 'auth',
    loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule),
    canActivate: [NegateAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

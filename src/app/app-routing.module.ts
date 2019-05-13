import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
   {
      path : '',
      redirectTo: 'home',
      pathMatch: 'full',
   },
   {
      path : 'home',
      loadChildren : './pages/home/home.module#HomeModule'
   },
   {
      path : 'trade',
      loadChildren : './pages/exchange/exchange.module#ExchangeModule'
   },
   {
      path: '**',
      redirectTo: ''
   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

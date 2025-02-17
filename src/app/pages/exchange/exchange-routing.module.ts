import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExchangeComponent } from './awrapper/exchange.component';
import { SimpleassetComponent } from './simpleasset/simpleasset.component';
import { EostradeComponent } from './eostrade/eostrade.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'sa'
	},
    {
        path: '',
        component: ExchangeComponent,
        children: [
        	{
        		path: 'sa',
        		component: SimpleassetComponent
    		},
    		{
        		path: 'eos',
        		component: EostradeComponent
    		},
            {
               path : 'wallet',
               loadChildren : './account/account.module#AccountModule'
            }
    	]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeRoutingModule { }

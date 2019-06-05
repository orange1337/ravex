import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './wrapper/profile.component';
import { WalletftComponent } from './walletft/walletft.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'ft'
	},
    {
        path: '',
        component: ProfileComponent,
        children: [
        	{
        		path: 'ft',
        		component: WalletftComponent
    		}
    	]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './wrapper/profile.component';
import { WalletftComponent } from './walletft/walletft.component';

import { ExchangeRoutingModule } from './account-router.module';

@NgModule({
  declarations: [ProfileComponent, WalletftComponent],
  imports: [
    CommonModule,
    ExchangeRoutingModule
  ]
})
export class AccountModule { }

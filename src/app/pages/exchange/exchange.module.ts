import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangeRoutingModule } from './exchange-routing.module';
import { ExchangeComponent } from './exchange-component/exchange.component';
import { SimpleassetComponent } from './simpleasset/simpleasset.component';
import { EostradeComponent } from './eostrade/eostrade.component';

import { MatTabsModule,
		 MatTableModule 
} from '@angular/material';

@NgModule({
  declarations: [ExchangeComponent, SimpleassetComponent, EostradeComponent],
  imports: [
    CommonModule,
    ExchangeRoutingModule,
    MatTabsModule,
    MatTableModule
  ]
})
export class ExchangeModule { }

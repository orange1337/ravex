import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangeRoutingModule } from './exchange-routing.module';
import { ExchangeComponent } from './exchange-component/exchange.component';
import { SimpleassetComponent } from './simpleasset/simpleasset.component';
import { EostradeComponent } from './eostrade/eostrade.component';

import { TvChartContainerComponent } from '../../components/tvchart/tvchart.component';

import { MatTabsModule,
		 MatTableModule 
} from '@angular/material';

import { MainService } from '../../../services/main.service';

@NgModule({
  declarations: [ExchangeComponent, SimpleassetComponent, EostradeComponent, TvChartContainerComponent],
  imports: [
    CommonModule,
    ExchangeRoutingModule,
    MatTabsModule,
    MatTableModule
  ],
  providers: [MainService]
})
export class ExchangeModule { }

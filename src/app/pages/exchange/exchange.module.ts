import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangeRoutingModule } from './exchange-routing.module';
import { ExchangeComponent } from './exchange-component/exchange.component';
import { SimpleassetComponent } from './simpleasset/simpleasset.component';
import { EostradeComponent } from './eostrade/eostrade.component';

import { TvChartContainerComponent } from '../../components/tvchart/tvchart.component';

import { MatTabsModule,
		 MatTableModule,
     MatButtonToggleModule
} from '@angular/material';

import { MainService } from '../../services/main.service';
import { ScatterService } from '../../services/scatter.service';
import { ToastaModule } from 'ngx-toasta';

@NgModule({
  declarations: [ExchangeComponent, SimpleassetComponent, EostradeComponent, TvChartContainerComponent],
  imports: [
    CommonModule,
    ExchangeRoutingModule,
    MatTabsModule,
    MatTableModule,
    MatButtonToggleModule,
    ToastaModule.forRoot()
  ],
  providers: [MainService, ScatterService]
})
export class ExchangeModule { }

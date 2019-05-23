import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangeRoutingModule } from './exchange-routing.module';
import { ExchangeComponent } from './awrapper/exchange.component';
import { SimpleassetComponent } from './simpleasset/simpleasset.component';
import { EostradeComponent } from './eostrade/eostrade.component';

import { TvChartContainerComponent } from '../../components/tvchart/tvchart.component';
import { TokensComponent } from '../../components/tokens/tokens.component';
import { BalancesComponent } from '../../components/balances/balances.component';
import { BuySellComponent } from '../../components/buy-sell/buy-sell.component';
import { ActiveOrdersComponent } from '../../components/active-orders/active-orders.component';
import { OrdersBookComponent } from '../../components/orders-book/orders-book.component';

import { MatTabsModule,
		 MatTableModule,
     MatButtonToggleModule,
     MatProgressSpinnerModule
} from '@angular/material';

import { MainService } from '../../services/main.service';
import { ScatterService } from '../../services/scatter.service';
import { ToastaModule } from 'ngx-toasta';

@NgModule({
  declarations: [
    ExchangeComponent, 
    SimpleassetComponent, 
    EostradeComponent, 
    TvChartContainerComponent,
    TokensComponent,
    BalancesComponent,
    BuySellComponent,
    ActiveOrdersComponent,
    OrdersBookComponent
  ],
  imports: [
    CommonModule,
    ExchangeRoutingModule,
    MatTabsModule,
    MatTableModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    ToastaModule.forRoot()
  ],
  providers: [MainService, ScatterService]
})
export class ExchangeModule { }

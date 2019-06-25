import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MainService } from '../../services/main.service';
import { ScatterService } from '../../services/scatter.service';
import { TranslateService } from '@ngx-translate/core';
import { LoginEOSService } from 'eos-ulm';

@Component({
    selector: 'buy-sell',
    templateUrl: './buy-sell.component.html'
})
export class BuySellComponent implements OnInit, OnDestroy {

    constructor(public mainService: MainService,
                public translate: TranslateService,
                public loginEOSService: LoginEOSService,
                public scatterService: ScatterService){}

    percentage = [25, 50, 75, 100];
    buy = {
    	token: 0,
    	currency: 0
    };
    sell = {
    	token: 0,
    	currency: 0
    };
    feeBuy = {
    	fee: 0,
    	pay: 0
    };
    feeSell = {
    	fee: 0,
    	get: 0
    };

    @Input() totalBalances;

    buyTokenCurrency(){
    	this.feeBuy.fee = this.buy.currency * this.buy.token * this.mainService.fee / 100;
    	this.feeBuy.pay = this.buy.currency + this.feeBuy.fee;
    }

    sellTokenCurrency(){
    	this.feeSell.fee = this.sell.currency * this.sell.token * this.mainService.fee / 100;
    	this.feeSell.get = this.sell.currency + this.feeSell.fee;
    }

    countPercentageBuy(per){
    	let bal = this.mainService.accountInfo.core_liquid_balance;
    	if (!bal){
    		return this.scatterService.showErr('Not enough balance to buy');
    	}
    	let balance = Number(bal.split(' ')[0]);
    	this.buy.currency = balance * per / 100;
    	this.buyTokenCurrency();
    }

    countPercentageSell(bal, per){
    	if (!bal){
    		return this.scatterService.showErr('Not enough balance to sell');
    	}
    	let balance = Number(bal.split(' ')[0]);
    	this.sell.currency = balance * per / 100;
    	this.sellTokenCurrency();
    }

    ngOnInit() {}

    ngOnDestroy() {}
}
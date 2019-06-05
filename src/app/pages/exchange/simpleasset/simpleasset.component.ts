import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../services/main.service';
import { ScatterService } from '../../../services/scatter.service';
import { LoginEOSService } from 'eos-ulm';

@Component({
  selector: 'app-simpleasset',
  templateUrl: './simpleasset.component.html',
  styleUrls: ['./simpleasset.component.scss']
})
export class SimpleassetComponent implements OnInit {

  constructor(public mainService: MainService, 
              public scatterService: ScatterService,
              public loginEOSService: LoginEOSService) { }

  displayedColumns             = ['symbol', 'price', 'change', 'volume'];
  displayedColumnsSells        = ['price', 'qty', 'total'];
  displayedColumnsBalances     = ['author', 'symbol', 'amount'];
  displayedColumnsActiveOrders = ['pair', 'author', 'type', 'amount', 'price', 'total'];
  displayedColumnsHistory      = ['date', 'price', 'qty'];
  tabsTokens                   = ['EOS'];
  tabsBalances                 = ['TOTAL_BALANCES'];
  tabsBook                     = ['ORDERS_BOOK', 'TRADE_HISTORY']; 
  tabsHistory                  = ['ACTIVE_ORDERS', 'HISTORICAL_ORDERS'];
  dataSource                   = [];
  dataSourceSells              = [];
  dataSourceHistory            = [];
  dataSourceBuys               = [];
  dataSourceBalances           = [];
  dataSourceActiveOrders: any  = [];
  coinsList                    = {};

  getCoinsTable(){
  		this.mainService.getSAcoins()
  						.subscribe((res: any) => {
  							this.dataSource = res.coins; 
                this.coinsList = this.mainService.generetCoinsArr(res);
                this.mainService.updateHeader.emit(this.coinsList[this.mainService.ftid]);
  						}, err => {	
  							console.error(err);
  						})
  }

  getOrderSells(){
      this.dataSourceSells = null;
  		this.mainService.getSAsells(this.mainService.author, this.mainService.symbol)
  						.subscribe((res: any) => {
  							this.dataSourceSells = this.countPercentage(res.orders);
  						}, err => {	
  							console.error(err);
  						})
  }
  countPercentage(data){
      if (!data) return;
      let max = 0;
      data.forEach(elem => {
          let vol = elem.priceNum * elem.qtyNum;
          max = (vol > max) ? vol : max;
      });
      data.forEach(elem => {
            elem.percentage = 100 - elem.priceNum * elem.qtyNum / max * 100;
      });
      return data;
  }
  getTradeHistory(){
        this.dataSourceHistory = null;
        this.mainService.getTradeHistory()
            .subscribe((res: any) => {
                 this.dataSourceHistory = this.mainService.generateOrdersHistoryArr(res);
              }, err => {  
                 console.error(err);
              });
  }

  getBalances(){
      this.scatterService.getAvailableItemsFT()
          .then(res => {
              if (!res || !res.rows){
                  return;
              }
              this.dataSourceBalances = res.rows.map(elem => {
                    let splitElem = elem.balance.split(" ");
                    return {id: elem.id, author: elem.author, symbol: splitElem[1], qty: splitElem[0]};
              });
          }).catch(err => {
              console.error(err);
          });
  }

  getActiveOrders(){
        this.dataSourceActiveOrders = null;
        this.mainService.getActiveOrders()
            .subscribe((res: any) => {
                this.displayedColumnsActiveOrders = ['pair', 'author', 'type', 'amount', 'price', 'total'];
                this.dataSourceActiveOrders = this.mainService.generateOrdersArr(res);
              }, err => {  
                console.error(err);
              });
  }

  getMyHistoryOrders(){
        this.dataSourceActiveOrders = null;
        this.mainService.getMyOrdersHistory()
            .subscribe((res: any) => {
                this.displayedColumnsActiveOrders = ['date', 'pair', 'author', 'type', 'amount', 'price', 'total', 'status'];
                this.dataSourceActiveOrders = this.mainService.generateOrdersArr(res);
              }, err => {  
                console.error(err);
              });
  }


  updateTokenView(event){
      this.mainService.updateHeader.emit(this.coinsList[this.mainService.ftid]);
      this.changeTabActiveView(event);
      this.changeHistoryTabs(event);
  }
 
  changeTabActiveView(event){
      if (this.mainService.activeOrders === 0){
          this.getActiveOrders();
      } else if (this.mainService.activeOrders === 1){
          this.getMyHistoryOrders();
      }
  }
  changeHistoryTabs(event){
      if (this.mainService.tradeH === 0){
          this.getOrderSells();
      } else if (this.mainService.tradeH === 1){
          this.getTradeHistory();
      }
  }

  ngOnInit() {
  	this.getCoinsTable();
  	this.getOrderSells();
    this.loginEOSService.loggedIn.subscribe(() => {
        this.getBalances();
        this.getActiveOrders();
    });
  }

}

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

  displayedColumns = ['symbol', 'price', 'change', 'volume'];
  displayedColumnsSells = ['price', 'qty', 'total'];
  displayedColumnsBalances = ['author', 'symbol', 'amount'];
  displayedColumnsActiveOrders = ['pair', 'author', 'type', 'amount', 'price', 'total'];
  dataSource = [];
  dataSourceSells = [];
  dataSourceBalances = [];
  dataSourceActiveOrders: any = [];
  coinsList = {};

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
  							this.dataSourceSells = res.orders;
  						}, err => {	
  							console.error(err);
  						})
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
      this.getOrderSells();
  }
 
  changeTabActiveView(event){
      if (this.mainService.activeOrders === 'active orders'){
          this.getActiveOrders();
      } else if (this.mainService.activeOrders === 'historical orders'){
          this.getMyHistoryOrders();
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

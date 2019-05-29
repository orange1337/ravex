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
  displayedColumnsBalances = ['symbol', 'amount', 'value'];
  dataSource: any;
  dataSourceSells: any;
  dataSourceBalances: any;
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

  updateTokenView(event){
      this.mainService.updateHeader.emit(this.coinsList[this.mainService.ftid]);
      this.getOrderSells();
  }
 

  ngOnInit() {
  	this.getCoinsTable();
  	this.getOrderSells();
    this.loginEOSService.loggedIn.subscribe(() => {
        this.getBalances();
    });
  }

}

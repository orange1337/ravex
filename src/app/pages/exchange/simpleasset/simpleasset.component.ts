import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../services/main.service';

@Component({
  selector: 'app-simpleasset',
  templateUrl: './simpleasset.component.html',
  styleUrls: ['./simpleasset.component.scss']
})
export class SimpleassetComponent implements OnInit {

  constructor(public mainService: MainService) { }

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

  updateTokenView(event){
      this.mainService.updateHeader.emit(this.coinsList[this.mainService.ftid]);
      this.getOrderSells();
  }
 

  ngOnInit() {
  	this.getCoinsTable();
  	this.getOrderSells();
  }

}

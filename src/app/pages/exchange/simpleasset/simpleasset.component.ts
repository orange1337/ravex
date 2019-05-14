import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../../services/main.service';

@Component({
  selector: 'app-simpleasset',
  templateUrl: './simpleasset.component.html',
  styleUrls: ['./simpleasset.component.scss']
})
export class SimpleassetComponent implements OnInit {

  constructor(public mainService: MainService) { }

  displayedColumns = ['symbol', 'price', 'change', 'volume'];
  displayedColumnsSells = ['price', 'qty', 'total'];
  dataSource;
  dataSourceSells;
  coinsList = {};
  author = 'prospectorsa';
  symbol = 'PTS';
  priceNull = '0.0000';

  getCoinsTable(){
  		this.mainService.getSAcoins()
  						.subscribe((res: any) => {
  							this.dataSource = res.coins; 
                this.coinsList = this.mainService.generetCoinsArr(res);
  						}, err => {	
  							console.error(err);
  						})
  }

  getOrderSells(){
  		this.mainService.getSAsells(this.author, this.symbol)
  						.subscribe((res: any) => {
  							this.dataSourceSells = res.orders;
  						}, err => {	
  							console.error(err);
  						})
  }

  ngOnInit() {
  	this.getCoinsTable();
  	this.getOrderSells();
  }


}

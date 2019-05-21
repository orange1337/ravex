import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { MainService } from '../../../services/main.service';

@Component({
  selector: 'app-simpleasset',
  templateUrl: './simpleasset.component.html',
  styleUrls: ['./simpleasset.component.scss']
})
export class SimpleassetComponent implements OnInit, AfterViewChecked {

  constructor(public mainService: MainService) { }

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  displayedColumns = ['symbol', 'price', 'change', 'volume'];
  displayedColumnsSells = ['price', 'qty', 'total'];
  displayedColumnsBalances = ['symbol', 'amount', 'value'];
  dataSource;
  dataSourceSells;
  dataSourceBalances;
  coinsList = {};

  getCoinsTable(){
  		this.mainService.getSAcoins()
  						.subscribe((res: any) => {
  							this.dataSource = res.coins; 
                this.coinsList = this.mainService.generetCoinsArr(res);
                let data = {
                    ...this.coinsList[this.mainService.ftid], 
                    symbol: this.mainService.symbol,
                    author: this.mainService.author
                };
                this.mainService.updateHeader.emit(data);
  						}, err => {	
  							console.error(err);
  						})
  }

  getOrderSells(){
  		this.mainService.getSAsells(this.mainService.author, this.mainService.symbol)
  						.subscribe((res: any) => {
  							this.dataSourceSells = res.orders;
  						}, err => {	
  							console.error(err);
  						})
  }
  
  scrollToBottom(): void {
      try {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }                 
  }

  ngOnInit() {
  	this.getCoinsTable();
  	this.getOrderSells();
  }
  
  ngAfterViewChecked() {        
        this.scrollToBottom();        
  }
}

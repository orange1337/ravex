import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../../services/main.service';
import { ScatterService } from '../../../../services/scatter.service';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit {

  coinInfo;
  constructor(public mainService: MainService, public scatterService: ScatterService) { }

  ngOnInit() {
  		this.mainService.updateHeader.subscribe( (res: any) => {
  				this.coinInfo = res;
  				console.log(res);
  		});
  }

}

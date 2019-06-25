import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../services/main.service';
import { ScatterService } from '../../../services/scatter.service';
import { LoginEOSService } from 'eos-ulm';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit {

  coinInfo;
  constructor(public mainService: MainService, 
              public scatterService: ScatterService,
              public loginEOSService: LoginEOSService,
              public router: Router,
              public translate: TranslateService) { }

  ngOnInit() {
  		this.mainService.updateHeader.subscribe( (res: any) => {
  				this.coinInfo = res;
          console.log(this.coinInfo);
  		});
      this.loginEOSService.loggedIn.subscribe(res => {
          this.scatterService.getAccount()
              .then(res => this.mainService.accountInfo = res)
              .catch(err => console.error(err));
      });
  }

}

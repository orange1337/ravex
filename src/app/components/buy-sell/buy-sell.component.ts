import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MainService } from '../../services/main.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'buy-sell',
    templateUrl: './buy-sell.component.html'
})
export class BuySellComponent implements OnInit, OnDestroy {

    constructor(public mainService: MainService,
                public translate: TranslateService){}

    ngOnInit() {}

    ngOnDestroy() {}
}
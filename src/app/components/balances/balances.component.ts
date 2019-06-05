import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MainService } from '../../services/main.service';

import { LoginEOSService } from 'eos-ulm';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'balances-left',
    templateUrl: './balances.component.html'
})
export class BalancesComponent implements OnInit, OnDestroy {

    @Input() columns;
    @Input() dataSource;
    @Input() tabs;

    constructor(public mainService: MainService, 
    			public loginEOSService: LoginEOSService,
    			public translate: TranslateService){}

    ngOnInit() {}

    ngOnDestroy() {}
}
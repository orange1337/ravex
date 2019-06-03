import { Component, Input, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { MainService } from '../../services/main.service';

import {LoginEOSService} from 'eos-ulm';

@Component({
    selector: 'active-orders',
    templateUrl: './active-orders.component.html'
})
export class ActiveOrdersComponent implements OnInit, OnDestroy {

    @Input() columns;
    @Input() dataSource;
    @Input() tabs;

    @Output() changeTab: EventEmitter<any> = new EventEmitter();

    constructor(public mainService: MainService, public loginEOSService: LoginEOSService){}

    selectTab(name){
    	this.mainService.activeOrders = name;
    	this.changeTab.emit();
    }

    ngOnInit() {}

    ngOnDestroy() {}
}
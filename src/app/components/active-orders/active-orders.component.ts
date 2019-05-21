import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MainService } from '../../services/main.service';


@Component({
    selector: 'active-orders',
    templateUrl: './active-orders.component.html'
})
export class ActiveOrdersComponent implements OnInit, OnDestroy {

    @Input() columns;
    @Input() dataSource;
    @Input() tabs;

    constructor(public mainService: MainService){}

    ngOnInit() {}

    ngOnDestroy() {}
}
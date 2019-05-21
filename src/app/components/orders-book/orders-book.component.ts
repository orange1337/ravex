import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MainService } from '../../services/main.service';


@Component({
    selector: 'orders-book',
    templateUrl: './orders-book.component.html'
})
export class OrdersBookComponent implements OnInit, OnDestroy {

    @Input() columns;
    @Input() dataSource;
    @Input() tabs;
    @Input() coinsList;

    tabIndex = 0;

    constructor(public mainService: MainService){}

    ngOnInit() {}

    ngOnDestroy() {}
}
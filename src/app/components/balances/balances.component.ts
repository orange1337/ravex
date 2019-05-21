import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MainService } from '../../services/main.service';


@Component({
    selector: 'balances-left',
    templateUrl: './balances.component.html'
})
export class BalancesComponent implements OnInit, OnDestroy {

    @Input() columns;
    @Input() dataSource;
    @Input() tabs;

    constructor(public mainService: MainService){}

    ngOnInit() {}

    ngOnDestroy() {}
}
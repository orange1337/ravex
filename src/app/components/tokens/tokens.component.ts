import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MainService } from '../../services/main.service';


@Component({
    selector: 'tokens-left',
    templateUrl: './tokens.component.html'
})
export class TokensComponent implements OnInit, OnDestroy {

    @Input() columns;
    @Input() dataSource;
    @Input() tabs;
    @Input() coinsList;

    constructor(public mainService: MainService){}

    ngOnInit() {}

    ngOnDestroy() {}
}
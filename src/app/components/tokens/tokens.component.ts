import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
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

    @Output() changeToken: EventEmitter<any> = new EventEmitter();

    constructor(public mainService: MainService){}

    selectTab(name){
    	this.mainService.currency = name;
    }

    selectCoin(ftid, name){
        this.mainService.ftid = ftid;
    	this.mainService.symbol = name;
    	this.changeToken.emit(null);
    }

    ngOnInit() {}

    ngOnDestroy() {}
}
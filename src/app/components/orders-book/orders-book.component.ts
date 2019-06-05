import { Component, Input, OnInit, OnDestroy,  ElementRef, ViewChild, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { MainService } from '../../services/main.service';


@Component({
    selector: 'orders-book',
    templateUrl: './orders-book.component.html'
})
export class OrdersBookComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() columns;
    @Input() columnsHistory;
    @Input() dataSource;
    @Input() dataSourceBuys;
    @Input() dataSourceHistory;
    @Input() tabs;
    @Input() coinsList;
    @Output() changeTab: EventEmitter<any> = new EventEmitter();

    tabIndex = 0;

    constructor(public mainService: MainService){}

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    scrollToBottom(): void {
      try {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }                 
    }

    createGradient(elem, index, color){
        let rowColor = (index % 2 === 0) ? '#16203f' : '#172442';
        return `linear-gradient(to right, ${rowColor} ${elem.percentage}%, ${color} 0%)`;
    }

    selectTab(elem){
        this.mainService.tradeH = elem;
        this.changeTab.emit();
    }

    ngOnInit() {}

    ngAfterViewChecked(){
        this.scrollToBottom();
    }

    ngOnDestroy() {}
}
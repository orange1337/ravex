import { Component, Input, OnInit, OnDestroy,  ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MainService } from '../../services/main.service';


@Component({
    selector: 'orders-book',
    templateUrl: './orders-book.component.html'
})
export class OrdersBookComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() columns;
    @Input() dataSource;
    @Input() tabs;
    @Input() coinsList;

    tabIndex = 0;

    constructor(public mainService: MainService){}

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    scrollToBottom(): void {
      try {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { console.error(err); }                 
    }

    ngOnInit() {
    }
    
    ngAfterViewInit(){
        this.scrollToBottom();
    }

    ngOnDestroy() {}
}
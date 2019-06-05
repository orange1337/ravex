import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletftComponent } from './walletft.component';

describe('WalletftComponent', () => {
  let component: WalletftComponent;
  let fixture: ComponentFixture<WalletftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

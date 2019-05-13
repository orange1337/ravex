import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EostradeComponent } from './eostrade.component';

describe('EostradeComponent', () => {
  let component: EostradeComponent;
  let fixture: ComponentFixture<EostradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EostradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EostradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

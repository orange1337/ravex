import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleassetComponent } from './simpleasset.component';

describe('SimpleassetComponent', () => {
  let component: SimpleassetComponent;
  let fixture: ComponentFixture<SimpleassetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleassetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

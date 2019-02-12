import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineUserBoxComponent } from './online-user-box.component';

describe('OnlineUserBoxComponent', () => {
  let component: OnlineUserBoxComponent;
  let fixture: ComponentFixture<OnlineUserBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineUserBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineUserBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

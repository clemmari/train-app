import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheludeTableComponent } from './schelude-table.component';

describe('ScheludeTableComponent', () => {
  let component: ScheludeTableComponent;
  let fixture: ComponentFixture<ScheludeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheludeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheludeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

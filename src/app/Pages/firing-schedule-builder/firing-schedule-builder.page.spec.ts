import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiringScheduleBuilderPage } from './firing-schedule-builder.page';

describe('FiringScheduleBuilderPage', () => {
  let component: FiringScheduleBuilderPage;
  let fixture: ComponentFixture<FiringScheduleBuilderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FiringScheduleBuilderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiringScheduleDetailPage } from './firing-schedule-detail.page';

describe('FiringScheduleDetailPage', () => {
  let component: FiringScheduleDetailPage;
  let fixture: ComponentFixture<FiringScheduleDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FiringScheduleDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

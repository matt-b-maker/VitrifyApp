import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFiringScheduleDetailPage } from './user-firing-schedule-detail.page';

describe('UserFiringScheduleDetailPage', () => {
  let component: UserFiringScheduleDetailPage;
  let fixture: ComponentFixture<UserFiringScheduleDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFiringScheduleDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

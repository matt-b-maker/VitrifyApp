import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFiringSchedulesPage } from './user-firing-schedules.page';

describe('UserFiringSchedulesPage', () => {
  let component: UserFiringSchedulesPage;
  let fixture: ComponentFixture<UserFiringSchedulesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFiringSchedulesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

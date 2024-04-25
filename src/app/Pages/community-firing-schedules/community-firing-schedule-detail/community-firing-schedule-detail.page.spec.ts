import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityFiringScheduleDetailPage } from './community-firing-schedule-detail.page';

describe('CommunityFiringScheduleDetailPage', () => {
  let component: CommunityFiringScheduleDetailPage;
  let fixture: ComponentFixture<CommunityFiringScheduleDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityFiringScheduleDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

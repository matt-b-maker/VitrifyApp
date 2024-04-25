import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityFiringSchedulesPage } from './community-firing-schedules.page';

describe('CommunityFiringSchedulesPage', () => {
  let component: CommunityFiringSchedulesPage;
  let fixture: ComponentFixture<CommunityFiringSchedulesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityFiringSchedulesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

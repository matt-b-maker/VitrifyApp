import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialsTabsPage } from './materials-tabs.page';

describe('MaterialsTabsPage', () => {
  let component: MaterialsTabsPage;
  let fixture: ComponentFixture<MaterialsTabsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

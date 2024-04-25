import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityRecipeDetailPage } from './community-recipe-detail.page';

describe('CommunityRecipeDetailPage', () => {
  let component: CommunityRecipeDetailPage;
  let fixture: ComponentFixture<CommunityRecipeDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityRecipeDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

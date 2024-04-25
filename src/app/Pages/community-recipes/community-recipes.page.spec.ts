import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityRecipesPage } from './community-recipes.page';

describe('CommunityRecipesPage', () => {
  let component: CommunityRecipesPage;
  let fixture: ComponentFixture<CommunityRecipesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityRecipesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

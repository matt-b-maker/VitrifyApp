import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserRecipeDetailPage } from './user-recipe-detail.page';

describe('UserRecipeDetailPage', () => {
  let component: UserRecipeDetailPage;
  let fixture: ComponentFixture<UserRecipeDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRecipeDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

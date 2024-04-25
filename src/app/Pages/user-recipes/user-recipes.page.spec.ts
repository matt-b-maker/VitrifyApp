import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserRecipesPage } from './user-recipes.page';

describe('UserRecipesPage', () => {
  let component: UserRecipesPage;
  let fixture: ComponentFixture<UserRecipesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRecipesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

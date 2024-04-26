import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeBuilderPage } from './recipe-builder.page';

describe('RecipeBuilderPage', () => {
  let component: RecipeBuilderPage;
  let fixture: ComponentFixture<RecipeBuilderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeBuilderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeEditorPage } from './recipe-editor.page';

describe('RecipeEditorPage', () => {
  let component: RecipeEditorPage;
  let fixture: ComponentFixture<RecipeEditorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

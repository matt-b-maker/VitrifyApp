import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeMakerPage } from './recipe-maker.page';

describe('RecipeMakerPage', () => {
  let component: RecipeMakerPage;
  let fixture: ComponentFixture<RecipeMakerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeMakerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

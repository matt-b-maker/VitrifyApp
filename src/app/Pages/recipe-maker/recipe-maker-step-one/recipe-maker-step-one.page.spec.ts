import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeMakerStepOnePage } from './recipe-maker-step-one.page';

describe('RecipeMakerStepOnePage', () => {
  let component: RecipeMakerStepOnePage;
  let fixture: ComponentFixture<RecipeMakerStepOnePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeMakerStepOnePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

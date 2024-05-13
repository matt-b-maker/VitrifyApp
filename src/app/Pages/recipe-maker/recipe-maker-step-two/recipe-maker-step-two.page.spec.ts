import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeMakerStepTwoPage } from './recipe-maker-step-two.page';

describe('RecipeMakerStepTwoPage', () => {
  let component: RecipeMakerStepTwoPage;
  let fixture: ComponentFixture<RecipeMakerStepTwoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeMakerStepTwoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

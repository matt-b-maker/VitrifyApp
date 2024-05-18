import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomMaterialsPage } from './custom-materials.page';

describe('CustomMaterialsPage', () => {
  let component: CustomMaterialsPage;
  let fixture: ComponentFixture<CustomMaterialsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMaterialsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicMaterialsPage } from './public-materials.page';

describe('PublicMaterialsPage', () => {
  let component: PublicMaterialsPage;
  let fixture: ComponentFixture<PublicMaterialsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicMaterialsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

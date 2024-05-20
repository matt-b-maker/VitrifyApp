import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MaterialsSelectComponent } from './materials-select.component';

describe('MaterialsSelectComponent', () => {
  let component: MaterialsSelectComponent;
  let fixture: ComponentFixture<MaterialsSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MaterialsSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

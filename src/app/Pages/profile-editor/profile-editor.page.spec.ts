import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileEditorPage } from './profile-editor.page';

describe('ProfileEditorPage', () => {
  let component: ProfileEditorPage;
  let fixture: ComponentFixture<ProfileEditorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

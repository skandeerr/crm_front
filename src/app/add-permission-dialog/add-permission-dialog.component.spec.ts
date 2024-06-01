import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPermissionDialogComponent } from './add-permission-dialog.component';

describe('AddPermissionDialogComponent', () => {
  let component: AddPermissionDialogComponent;
  let fixture: ComponentFixture<AddPermissionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPermissionDialogComponent]
    });
    fixture = TestBed.createComponent(AddPermissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

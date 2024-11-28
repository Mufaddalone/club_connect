import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRegisterComponent } from './register-student.component';

describe('RegisterStudentComponent', () => {
  let component: StudentRegisterComponent;
  let fixture: ComponentFixture<StudentRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

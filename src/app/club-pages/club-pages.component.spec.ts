import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubPagesComponent } from './club-pages.component';

describe('ClubPagesComponent', () => {
  let component: ClubPagesComponent;
  let fixture: ComponentFixture<ClubPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

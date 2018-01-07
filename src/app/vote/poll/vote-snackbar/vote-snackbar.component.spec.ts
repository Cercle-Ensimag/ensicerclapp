import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteSnackbarComponent } from './vote-snackbar.component';

describe('CustomSnackbarComponent', () => {
  let component: VoteSnackbarComponent;
  let fixture: ComponentFixture<VoteSnackbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteSnackbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

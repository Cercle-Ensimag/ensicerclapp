import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteUsersComponent } from './vote-users.component';

describe('VoteUsersComponent', () => {
  let component: VoteUsersComponent;
  let fixture: ComponentFixture<VoteUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

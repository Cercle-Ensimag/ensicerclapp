import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterAddUsersComponent } from './filter-add-users.component';

describe('FilterAddUsersComponent', () => {
  let component: FilterAddUsersComponent;
  let fixture: ComponentFixture<FilterAddUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterAddUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterAddUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

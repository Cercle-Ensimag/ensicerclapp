import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionalRouterLinkComponent } from './conditional-router-link.component';

describe('ConditionalRouterLinkComponent', () => {
  let component: ConditionalRouterLinkComponent;
  let fixture: ComponentFixture<ConditionalRouterLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionalRouterLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionalRouterLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

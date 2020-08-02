import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JournalistComponent } from './journalist.component';

describe('JournalistComponent', () => {
  let component: JournalistComponent;
  let fixture: ComponentFixture<JournalistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
